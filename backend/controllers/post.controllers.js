const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const httpStatus = require('../utils/http.status');
const asyncWrapper = require('../middleware/async.wrapper');
const sanitize = require('mongo-sanitize');
const AppError = require('../utils/app.error');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Post = require('../models/post.model');

const createPost = asyncWrapper(
    async (req, res, next) =>{
        const {content,attachments} = sanitize (req.body);
        const publisher = sanitize (req.user.id); 
        const post = await Post.create({content,attachments,publisher});
        res.status(200).json({status: httpStatus.Success,data: {post, message: 'Post created successfully'}}); 
    }
);

const editPost = asyncWrapper(
    async (req, res, next) =>{
        const {content,attachments} = sanitize (req.body);
        const postId = sanitize (req.params.id);
        const post = await Post.findOne({_id: postId});
        post.content = content;
        post.attachments = attachments;
        post.date = Date.now(); 
        await post.save();
        res.status(200).json({status: httpStatus.Success,data: {message: 'Post edited successfully'}});
    }
)


module.exports={
    createPost,
    editPost
}