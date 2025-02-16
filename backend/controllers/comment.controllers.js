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

module.exports={
    editComment
}