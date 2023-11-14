const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');
const CategoryRouter = require('./route/categoryRoute');
const UserRouter = require('./route/userRoute')
const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const cookieParser = require('cookie-parser')

// Middleware to parse JSON in request body
app.use(express.json());
app.use(cookieParser());
app.use(cors())
// Sample data (in-memory database for simplicity)
app.get('/',(req,res)=>{
  res.send('Welcome to Blog API');
})
app.use('/api',CategoryRouter);
app.use('/auth',UserRouter);

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
