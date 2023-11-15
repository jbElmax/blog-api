const Comment = require('../model/commentsModel')

const createComment = (user,comment)=>Comment.create({user,comment});

module.exports = {
    createComment
}