const jwt = require('jsonwebtoken');
const User = require('../model/userModel')
const {authentication,random} = require('../helper/index');
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
        const payload = {
            _id:user._id,
            username:user.username,
            isAdmin:user.isAdmin
        }
        const accessToken = jwt.sign({"userInfo":payload},process.env.SECRET,{expiresIn:'15m'});
        const refreshToken = jwt.sign({"username":user.username},process.env.REFRESH_SECRET,{expiresIn:'1d'});
        user.authentication.sessionToken = refreshToken
        await user.save();

        res.cookie('auth',refreshToken,{httpOnly:true,sameSite:'none',secure:true,maxAge:24 * 60 * 60 * 1000})
        return res.status(200).json(accessToken);
    }catch(error){
        console.log(error);
        return res.status(200).json('error in logging in user');
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
            },
            isAdmin:false
        })
        return res.status(200).json(user);
    }catch(error){
        console.log(error.message);
        return res.status(500).json('an error occured while registering user.');
        
    }
}

module.exports = {
    loginUser,
    registerUser
}