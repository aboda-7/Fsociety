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
const Profile = require('../models/profile.model'); 

const postDataChecker = asyncWrapper(
    async (req, res, next) => {
        const {content,attachments} = sanitize (req.body);

        if(!content){
            const error = AppError.create('Content is required', 400, httpStatus.Error);
            return next(error);
        }

        if (attachments && !Array.isArray(attachments)) {
            return next(new AppError('Attachments must be an array.', 400));
        }

        next();
    }
)

const editPost = asyncWrapper(
    async (req, res, next) => {
        let{content,attachments} = sanitize (req.body);
        const postId = sanitize (req.params.id);
        const post = await Post.findOne({_id: postId});
        const editor = sanitize (req.user.id);


        if(editor !== post.publisher.toString()){
            const error = AppError.create('You are not allowed to edit this post', 403, httpStatus.Error);
            return next(error);
        }

        next();
    }
)

const isPost = asyncWrapper(
    async (req, res, next) => {
        const postId = sanitize(req.params.id); 
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError("Post not found", 404));
        }
        next();
    }
);

const deletePost = asyncWrapper(
    async (req,res,next) => {
        const postId = sanitize(req.params.id);
        const post = await Post.findById(postId);
        const editor = sanitize(req.user.id);
        if(editor !== post.publisher.toString() && editor.role !== 'admin' && editor.role !== 'owner'){
            return next(new AppError('You are not allowed to delete this post', 403, httpStatus.Error));
        }
        const profile = await Profile.findOne({user : editor});
        await profile.posts.pull(postId);
        await profile.save();
        await Comment.deleteMany({ _id: { $in: post.comments } });
        post.comments = [];
        post.likes = [];
        await post.save(); 
        next();
    }
)


module.exports={
    postDataChecker,
    editPost,
    isPost,
    deletePost,
}