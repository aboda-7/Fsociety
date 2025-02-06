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

const createPost = asyncWrapper(
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


module.exports={
    createPost
}