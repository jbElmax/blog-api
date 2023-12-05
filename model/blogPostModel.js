
const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        content:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:false
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        },
        comments:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment',
            required:false
        }],
        isFeatured:{
            type:Boolean,
            required:true   
        },
        tags:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tag'
        }]
    },
    {
        timestamps:true
    }
);

const BlogPost = mongoose.model('BlogPost',blogPostSchema);

module.exports = BlogPost;