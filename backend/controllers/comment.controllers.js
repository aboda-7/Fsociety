const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const httpStatus = require('../utils/http.status');
const asyncWrapper = require('../middleware/async.wrapper');
const sanitize = require('mongo-sanitize');
const AppError = require('../utils/app.error');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model')

const editComment = asyncWrapper(
    async (req, res, next) => {
        const content = sanitize(req.body.content);
        const commentId = sanitize(req.params.id);
        const comment = await Comment.findById(commentId);
        comment.content = String(content);
        comment.date = Date.now();
        await comment.save();
        res.status(200).json({status: httpStatus.Success, data: { message: 'Comment edited successfully' }}); 
    }
)

const likeComment = asyncWrapper(async (req, res, next) => {
    const commentId = sanitize(req.params.id); 
    const userId = sanitize(req.user.id);
    const comment = await Comment.findById(commentId); 
    const hasLiked = comment.likes.includes(userId);
    if (hasLiked) comment.likes.pull(userId);
    else  comment.likes.addToSet(userId);
    await comment.save();
    res.status(200).json({status: httpStatus.Success, data: { likes: comment.likes.length, message: hasLiked ? "comment unliked" : "Comment liked" }});
})

const deleteComment = asyncWrapper(async (req, res, next)=>{
    const commentId = sanitize(req.params.id);
    const comment = await Comment.findById(commentId);
    await comment.deleteOne();
    return res.status(200).json({status: httpStatus.Success, data: {message: 'Comment deleted successfully'}});
})

const getComment= asyncWrapper(
    async(req, res, next) =>{
        const commentId = sanitize(req.params.id);
        const comment = await Comment.findById(commentId);
        return res.status(200).json({status: httpStatus.Success, data: { comment }});
    }
)

module.exports={
    editComment,
    likeComment,
    deleteComment,
    getComment
}