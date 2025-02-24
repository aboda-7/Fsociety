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

const createPost = asyncWrapper(
    async (req, res, next) =>{
        const {content,attachments} = sanitize (req.body);
        const publisher = sanitize (req.user.id); 
        const post = await Post.create({content,attachments,publisher});
        const publisherProf = await Profile.findOne({user : publisher});
        await publisherProf.posts.push(post._id);
        await publisherProf.save();
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

const likePost = asyncWrapper(async (req, res, next) => {
    const postId = sanitize(req.params.id); 
    const userId = sanitize(req.user.id);
    const post = await Post.findById(postId); 
    const hasLiked = post.likes.includes(userId);
    if (hasLiked) post.likes.pull(userId);
    else  post.likes.addToSet(userId);
    await post.save();
    res.status(200).json({status: httpStatus.Success, data: { likes: post.likes.length, message: hasLiked ? "Post unliked" : "Post liked" }});
})

const addComment = asyncWrapper(async (req, res, next) => {
    const {content} = sanitize(req.body);
    const postId = sanitize(req.params.id);
    const commenter = sanitize(req.user.id);
    const comment = await Comment.create({content, post: postId, writer: commenter});
    const post = await Post.findById(postId);
    post.comments.addToSet(comment.id);
    await post.save();
    res.status(200).json({status: httpStatus.Success, data: { message: 'Comment added successfully' }});
});

const deletePost = asyncWrapper(async (req, res, next) => {
    const postId = sanitize(req.params.id);
    await Post.findByIdAndDelete(postId)
    res.status(200).json({status: httpStatus.Success, data: { message: 'Post deleted successfully' }});
});

const getPost = asyncWrapper(
    async (req, res, next)=>{
        const postId = sanitize(req.params.id);
        const post= await Post.findById(postId);
        return res.status(200).json({status: httpStatus.Success, data: { post }})
    }
)

module.exports={
    createPost,
    editPost,
    likePost,
    addComment,
    deletePost,
    getPost
}