const Tag = require('../model/tagModel');

const createTag = async(req,res)=>{
    try{
        const tag = await Tag.create(req.body);
        return res.status(201).json(tag);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
const getAllTags = async(req,res)=>{
    try{
        const tags = await Tag.find();
        return res.status(200).json(tags);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

module.exports = {
    createTag,
    getAllTags
}