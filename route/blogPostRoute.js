const express = require('express');
const {createBlogPost, addCommentOnPost, getAllPost, getPostWithComments, getFeaturedPost, getAllPostOfAuthor} = require('../controller/blogPostController');
const {isAuthenticated} = require('../middleware/index')
const BlogRouter = express.Router();

BlogRouter.post('/blog',createBlogPost);
BlogRouter.post('/blog/:postId/comment',isAuthenticated,addCommentOnPost);
BlogRouter.get('/blog',getAllPost);
BlogRouter.get('/blog/featured',getFeaturedPost);
BlogRouter.get('/blog/:postId',getPostWithComments);
BlogRouter.get('/blog/author/:authorId',getAllPostOfAuthor);

module.exports = BlogRouter;