const User = require('../model/userModel');
const {random,authentication} = require('../helper/index');

const getUserBySessionToken = (sessionToken)=>User.findOne({'authentication.sessionToken':sessionToken});
const deleteUserById = (id)=>User.findByIdAndDelete(id);
const getUserById = (id)=>User.findById(id);

const getUsers = ()=> User.find();
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
const logoutUser = async(req,res)=>{
    try{
        const sessionToken = req.cookies['USER-AUTH'];

        if(!sessionToken){
            return res.sendStatus(403);
        }
        const user = await getUserBySessionToken(sessionToken);
        if(!user){
            return res.sendStatus(403);
        }
        user.authentication.sessionToken = null;
        await user.save();
        res.clearCookie('USER-AUTH', { domain: 'localhost', path: '/' });

        return res.status(200).json({ message: 'Logout successful' });
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
const getAllUsers = async(req,res)=>{
    try{
        const users = await getUsers();
        return res.status(200).json(users);
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}
const deleteUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
const updateUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const {username} = req.body;

        if(!username){
            return res.sendStatus(400);
        }

        const user = await getUserById(id);
        user.username = username;
        await user.save();

        return res.status(200).json(user);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserBySessionToken,
    getAllUsers,
    deleteUser,
    updateUser,
    logoutUser
}