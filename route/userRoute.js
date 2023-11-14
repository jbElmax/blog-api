
const express = require('express');

const userRouter = express.Router();
const {registerUser, loginUser, getAllUsers, deleteUser, updateUser} = require('../controller/userController');
const {isAuthenticated,isOwner} = require('../middleware');

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/users',isAuthenticated, getAllUsers);
userRouter.delete('/users/:id',isAuthenticated,isOwner, deleteUser);
userRouter.patch('/users/:id',isAuthenticated,isOwner, updateUser);

module.exports = userRouter