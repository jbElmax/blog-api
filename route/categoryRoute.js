const express = require('express');
const {createCategory, getCategories, updateCategory, deleteCategory} = require("../controller/categoryController");

const CategoryRouter = express.Router();

CategoryRouter.post('/category',createCategory);
CategoryRouter.get('/category',getCategories);
CategoryRouter.put('/category/:id',updateCategory);
CategoryRouter.delete('/category/:id',deleteCategory);
module.exports =  CategoryRouter;
