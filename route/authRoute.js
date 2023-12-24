
const express = require('express');
const {loginUser, registerUser} = require('../controller/authController')
const authRoute = express.Router();

authRoute.post('/login',loginUser);
authRoute.post('/register',registerUser);

module.exports = authRoute;