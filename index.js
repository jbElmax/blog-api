const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');
const CategoryRouter = require('./route/categoryRoute');
//const UserRouter = require('./route/userRoute')
const AuthRoute = require('./route/authRoute');
const BlogRouter = require('./route/blogPostRoute');
const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const FRONTEND = process.env.FRONTEND;
const cookieParser = require('cookie-parser');
const TagRoute = require('./route/tagRoute');

// Middleware to parse JSON in request body
app.use(express.json());
app.use(cookieParser());
var corsOptions = {
  origin: [FRONTEND,'http://localhost:3000'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
// Sample data (in-memory database for simplicity)
app.get('/',(req,res)=>{
  res.send('Welcome to Blog API');
})
app.use('/api',CategoryRouter);
app.use('/api',BlogRouter);
app.use('/api',TagRoute);
app.use('/auth',AuthRoute);


const runServer = async()=>{
  try{
    await mongoose.connect(MONGO_URL)
    .then(()=>{console.log('Connected to MongoDB')});
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }catch(error){
    console.log(error.message);
  }
}
runServer();
