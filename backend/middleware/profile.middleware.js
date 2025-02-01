const asyncWrapper = require('./async.wrapper');
const AppError = require('../utils/app.error');
const httpStatus = require('../utils/http.status');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const profile = require('../models/profile.model');
const sanitize = require('mongo-sanitize');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {userFind} = require('../utils/user.find');
const Profile = require('../models/profile.model');

const checkPassword = asyncWrapper( 
    async (req, res, next) => {
        const { email } = sanitize(req.params); 
        const { prevPassword} = sanitize(req.body);
        const user = await User.findOne({ email });
        if (!user) {
            const error = AppError.create("User not found", 404, httpStatus.Error);
            return next(error); 
        }
        const passwordMatch = await bcrypt.compare(prevPassword, user.password);
        if (!passwordMatch) {
            const error = AppError.create("Incorrect previous password", 401, httpStatus.Error);
            return next(error);
        }
        next();
    }
);

const isOwner = asyncWrapper(
    async (req, res, next) => {
        const loggedInUserId = sanitize(req.user.id);
        const loggedInUserRole = sanitize(req.user.role);
        if (loggedInUserRole !== 'owner') {
            const error = AppError.create('You are not authorized to perform this action', 401, httpStatus.Error);
            return next(error);
        }
        next();
    }
);

const promoteUser = asyncWrapper(
    async (req, res, next) => {
        const { userName } = sanitize(req.params);
        const user = await User.findOne({ userName });
        if (!user) {
            const error = AppError.create('User not found', 404, httpStatus.Error);
            return next(error);
        }
        if (user.role !== 'user') {
            const error = AppError.create('cannot promote this user', 400, httpStatus.Error);
            return next(error);
        }
        next();
    }
);

const demoteUser = asyncWrapper(
    async (req, res, next) => {
        const { userName } = sanitize(req.params);
        const user = await User.findOne({ userName });  
        if (!user) {
            const error = AppError.create('User not found', 404, httpStatus.Error);
            return next(error);
        }
        if (user.role !== 'admin') {
            const error = AppError.create('cannot demote this user', 400, httpStatus.Error);
            return next(error);
        }
        next();
    }
);

const checkProfile=asyncWrapper(
    async ( req, res, next) =>{
        const { bio } = sanitize(req.body); 
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return next(new AppError('Profile not found', httpStatus.NotFound));
        }
        next();
    }
);


  
module.exports = {
    checkPassword,
    isOwner,
    promoteUser,
    demoteUser,
    checkProfile
}
