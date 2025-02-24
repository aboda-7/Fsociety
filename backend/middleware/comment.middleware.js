const asyncWrapper = require('./async.wrapper');
const AppError = require('../utils/app.error');
const httpStatus = require('../utils/http.status');
const User = require('../models/user.model');
const sanitize = require('mongo-sanitize');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {userFind} = require('../utils/user.find');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model'); 

const isComment = asyncWrapper( 
    async (req, res, next) => {
        const commentId = sanitize(req.params.id);
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }
        next();
        
    }
);

const checkComment = asyncWrapper(
    async (req, res, next) => {
        const content = sanitize(req.body);
    
        if (!content) {
            return next(new AppError('Content is required', 400));
        }
        next();
        
    }
);

const editorCheck = asyncWrapper(
    async (req, res, next) => {
        const commentId = sanitize(req.params.id);
        const comment = await Comment.findById(commentId);
        const editor = sanitize(req.user.id);
        if (editor !== comment.writer.toString()) {
            return next(new AppError('You are not allowed to edit this comment', 403));
        }
        next();
    }
)

const deleteComment = asyncWrapper(
    async (req, res, next) => {
        const commentId = sanitize(req.params.id);
        const comment = await Comment.findById(commentId);
        const post = await Post.findById(comment.post);
        const actorId = sanitize(req.user.id);
        const actor = await User.findById(actorId);
        if (actorId !== comment.writer.toString() && actor.role !== 'admin'&& actor.role !== 'owner'){
            return next(new AppError('You are not allowed to delete this comment', 403));
        }
        post.comments.pull(commentId);
        await post.save();
        comment.likes = [];
        await comment.save();
        next();
    }
)

module.exports = {
    isComment,
    checkComment,
    editorCheck,
    deleteComment
}