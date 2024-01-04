const express = require('express');
const {createBlogPost, addCommentOnPost, getAllPost, getPostWithComments, getFeaturedPost, getAllPostOfAuthor, deletePostOfAuthor, getPostByCategory, updatePost, getPostByTagName} = require('../controller/blogPostController');
const {verifyJWT} = require('../middleware/verifyJWT')
const BlogRouter = express.Router();

BlogRouter.post('/blog',verifyJWT,createBlogPost);
BlogRouter.post('/blog/:postId/comment',verifyJWT,addCommentOnPost);
BlogRouter.get('/blog',getAllPost);
BlogRouter.get('/blog/featured',getFeaturedPost);
BlogRouter.get('/blog/:postId',getPostWithComments);
BlogRouter.delete('/blog/:postId',verifyJWT,deletePostOfAuthor);
BlogRouter.put('/blog/:postId',updatePost);
BlogRouter.get('/blog/author/:authorId',getAllPostOfAuthor);
BlogRouter.get('/blog/category/:categoryId',getPostByCategory);
BlogRouter.get('/blog/search-by-tag/:tagName',getPostByTagName);

module.exports = BlogRouter;