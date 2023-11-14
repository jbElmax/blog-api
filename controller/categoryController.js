
const Category = require("../model/categoryModel");
const createCategory = async(req,res)=>{
    try{
        const {categoryName,description} = req.body;
        if(!categoryName || !description){
            res.status(400).json('bad request');
        }
        const category = await Category.create(req.body);
        res.status(200).json(category);
    }catch(error){
        res.status(500).json(error);
    }
}
const getCategories = async(req,res)=>{
    try{
        const categories = await Category.find();
        res.status(200).json(categories);
    }catch(error){
        console.log(error.message)
        res.status(500).json(`error occured ${error}`);
    }
}
const updateCategory = async(req,res) =>{
    try{
        const {id} = req.params;     
        const category =await Category.findByIdAndUpdate(id,req.body);
        if(!category){
            res.status(404).json(`category not found with id:${id}`);
        }
        const updatedCategory =await Category.findById(id);
        res.status(200).json(updatedCategory);
    }catch(error){
        console.log(error.message);
        res.status(500).json(error);
    }
}
const deleteCategory = async(req,res)=>{
    try{
        const {id} = req.params;
        const category = await Category.findByIdAndDelete(id);
        if(!category){
            res.status(404).json('category not found')
        }
        res.status(200).json('category deleted');
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports={
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}