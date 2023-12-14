const BlogPost = require('../model/blogPostModel');
const Tag = require('../model/tagModel');
const {createComment} = require('../controller/commentController');
const createBlogPost = async(req,res)=>{
    try{
        
        const {title,content,image,author,category,tags,isFeatured} = req.body;
       
        const tagIds = await mapTagsToIds(tags);
        const blogPost = await BlogPost.create({
            title,
            content,
            image,
            author,
            category,
            isFeatured,
            tags:tagIds,
            
        });
        if(blogPost){
            return res.status(200).json(blogPost);
        }else{
            return res.status(400).json('unable to create blog post');
        }
        
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
// Your mapTagsToIds function could look like this
async function mapTagsToIds(tags) {
    const tagIds =await Promise.all(tags.map(tag => getTagIdFromDatabase(tag)));
    return tagIds;
  }
  
  async function getTagIdFromDatabase(tag) {

    const tagObject = await Tag.findOne({name:tag});

    if(!tagObject){//not found
        //create 1st the tag

        const newTag =await Tag.create({name:tag})
        return newTag._id;
    }
    return tagObject._id;
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

        const post = await BlogPost.find()
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

const getAllPostOfAuthor = async(req,res)=>{
    const {authorId} = req.params;
    const post = await BlogPost.find({author:authorId})
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
}
const getPostByCategory = async(req,res)=>{
    const {categoryId} = req.params;
    const post = await BlogPost.find({category:categoryId})
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
}

const deletePostOfAuthor = async(req,res)=>{
    const {postId} = req.params;
    const postExist = await BlogPost.findById(postId);
    if(!postExist){
        return res.status(404).json('post not found');
    }

    await BlogPost.findByIdAndDelete(postId);
    return res.status(200).json('post deleted successfully');
}
const updatePost = async(req,res)=>{
    try{
        const {postId} = req.params;
        const {title,content,image,author,category,tags,isFeatured} = req.body;
        console.log(req.body);
        const tagNames = tags.map(tag => tag.name)
        const tagIds = await mapTagsToIds(tagNames);
        const post = await BlogPost.findById(postId);
        if(!post){
            return res.status(404).json('blog post not foound');
        }
        post.title = title
        post.content = content
        post.image = image
        post.author = author
        post.category = category
        post.isFeatured = isFeatured
        post.tags = tagIds
        await post.save();
       
        return res.status(200).json(post);
    }catch(error){
        console.log(error);
        return res.status(500).json('error occured while updating blog post');
    }
}


module.exports = {
    createBlogPost,
    addCommentOnPost,
    getAllPost,
    getPostWithComments,
    getFeaturedPost,
    getAllPostOfAuthor,
    deletePostOfAuthor,
    getPostByCategory,
    updatePost

}