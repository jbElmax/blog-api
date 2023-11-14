const User = require('../model/userModel');
const {random,authentication} = require('../helper/index');

const getUsers = async(req,res)=>{
    try{
        const users = await User.find();
        return res.status(200).json(users);
    }catch(error){
        console.log(error);
        return res.status(500).json('error occured while getting users');
    }
}

const registerUser = async(req,res)=>{
    try{
        const {email,username,password} = req.body;
        if(!email || !username || !password){
            return res.status(400).json('bad request, please supply all required fields');
        }

        const existingUser =await User.findOne({email});
        if(existingUser){
            return res.status(400).json(`user already exist with email:${email}`);
        }
        
        const salt = random();
        const user =await User.create({
            email,
            username,
            authentication:{
                salt,
                password:authentication(salt,password)
            }
        })
        return res.status(200).json(user);
    }catch(error){
        console.log(error.message);
        return res.status(500).json('an error occured while registering user.');
        
    }
}
const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json('bad request, please provide email and password')
        }
        const user = await User.findOne({email}).select('+authentication.salt +authentication.password');
        if(!user){
            return res.status(404).json('user not found');
        }
        const expectedHash = authentication(user.authentication.salt,password);
        if(user.authentication.password !=expectedHash){
            return res.status(403).json('invalid credential');
        }

        const salt = random();
        const sessionToken = authentication(salt,user._id.toString());
        user.authentication.sessionToken = sessionToken
        await user.save();

        res.cookie('USER-AUTH',user.authentication.sessionToken,{domain:'localhost',path:'/'})
        return res.status(200).json(user);
    }catch(error){
        console.log(error);
        return res.status(500).json('error occured while logging in')
    }
}

module.exports = {
    registerUser,
    loginUser
}