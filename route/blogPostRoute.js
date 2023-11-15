const express = require('express');
const {createBlogPost, addCommentOnPost, getAllPost, getPostWithComments} = require('../controller/blogPostController');
const {isAuthenticated} = require('../middleware/index')
const BlogRouter = express.Router();

BlogRouter.post('/blog',createBlogPost);
BlogRouter.post('/blog/:postId/comment',isAuthenticated,addCommentOnPost);
BlogRouter.get('/blog',getAllPost);
BlogRouter.get('/blog/:postId',getPostWithComments);

module.exports = BlogRouter;