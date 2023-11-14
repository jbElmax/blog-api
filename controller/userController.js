const User = require('../model/userModel');

const getUsers = async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(error){
        console.log(error);
        res.status(500).json('error occured while getting users');
    }
}

const registerUser = async(req,res)=>{

}