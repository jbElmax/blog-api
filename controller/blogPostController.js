const BlogPost = require('../model/blogPostModel');
const {createComment} = require('../controller/commentController');
const createBlogPost = async(req,res)=>{
    try{
        const blogPost = await BlogPost.create(req.body);
        return res.status(200).json(blogPost);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
const addCommentOnPost = async(req,res)=>{
    try{
        const {postId} = req.params;
        const {user,comment} = req.body;
        const newComment = await createComment(user,comment);

        const post =await BlogPost.findById(postId);
        if(!post){
            return res.sendStatus(404);
        }
        post.comments.push(newComment);

        await post.save();

        return res.status(201).json(post);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
const getAllPost = async(req,res)=>{
    try{
        const blogPosts =await BlogPost.find();
        return res.status(200).json(blogPosts);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
const getPostWithComments = async(req,res)=>{
    try{
        const {postId} = req.params;
        const post = await BlogPost.findById(postId)
            .populate('author','username')
            .populate('category')
            .populate('tags')
            .populate({
            path:'comments',
            populate:{
                path:'user',
                model:'User'
            }
        });
        if(!post){
            return res.sendStatus(404);
        }
        return res.status(200).json(post);


    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
const getFeaturedPost = async(req,res)=>{
    try{
        const {postId} = req.params;
        const post = await BlogPost.find({isFeatured:true})
            .populate('author','username')
            .populate('category')
            .populate({
            path:'comments',
            populate:{
                path:'user',
                model:'User'
            }
        });
        if(!post){
            return res.sendStatus(404);
        }
        return res.status(200).json(post);


    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
module.exports = {
    createBlogPost,
    addCommentOnPost,
    getAllPost,
    getPostWithComments,
    getFeaturedPost
}