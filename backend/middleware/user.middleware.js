const asyncWrapper = require('./async.wrapper');
const AppError = require('../utils/app.error');
const httpStatus = require('../utils/http.status');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const sanitize = require('mongo-sanitize');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {userFind} = require('../utils/user.find');
const Profile = require('../models/profile.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');


const foundUser = asyncWrapper(async (req, res, next) => {
    const { email, userName } = sanitize(req.body);
    
    // Check if email exists
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
        const error = AppError.create("Email already exists", 400, httpStatus.Error);
        return next(error);
    }
    
    // Check if username exists
    const foundUserName = await User.findOne({ userName });
    if (foundUserName) {
        const error = AppError.create("Username already exists", 400, httpStatus.Error);
        return next(error);
    }
    
    next();
});

const passwordEncryption = asyncWrapper( async (req,res,next) => {
    const {password} = sanitize(req.body);
    const encryptedPassword = await bcrypt.hash(String(password),10);
    req.body.password = encryptedPassword;
    next();
});

const checkInputAndPassword = asyncWrapper(async (req, res, next) => {
    let {input, password} = sanitize(req.body);
    password = String(password);
    const user = await userFind(input);
    const passwordMatch = await bcrypt.compare(password, user.password);
    // If no user is found
    if (!user || !passwordMatch) {
        const error = AppError.create("Email or Password is incorrect", 404 , httpStatus.Error);
        return next(error);
    }

    next();
});

const checkInput = asyncWrapper(async (req, res, next) => {
    let input = sanitize(req.body);
    if(!input){
        const error = AppError.create("Email or Username required", 400 , httpStatus.Error);
        return next(error);
    } 
    const user = userFind(input);
    console.log(user);
    // If no user is found
    if (!user) {
        const error = AppError.create("Email or UserName incorrect", 404 , httpStatus.Error);
        return next(error);
    }
    
    req.user = user;
    next();
});

const checkAuthorization = asyncWrapper(async (req, res, next) => {
    const { email } = sanitize(req.params);
    const loggedInUserId = sanitize(req.user.id);
    const user = await User.findById(loggedInUserId);
    const loggedInUserRole = User.role;

    if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'owner') {
        const error = AppError.create('You are not authorized to perform this action', 401, httpStatus.Error);
        return next(error);
    }
    const userToDelete = await User.findOne({email : email});
    if (!userToDelete) {
        const error = AppError.create('User not found', 404, httpStatus.Error);
        return next(error);
    }

    next();
});

const deleteUser=asyncWrapper(
    async(req, res, next)=>{
        const {email} = sanitize(req.params);
        const userToDelete = await User.findOne({email});
        const profileToDelete = await Profile.findOne({user : userToDelete._id});

        for(const followerId of profileToDelete.followers){
            const follower = await User.findById(followerId);
            follower.followingCount--;
            await follower.save();
            const followerProf= await Profile.findOne({user : followerId});
            followerProf.following.pull(userToDelete._id);
            await followerProf.save();
        }

        for(const followedId of profileToDelete.following){
            const followed = await User.findById(followedId);
            followed.followersCount--;
            await followed.save();
            const followedProf= await Profile.findOne({user : followedId});
            followedProf.followers.pull(userToDelete._id);
            await followerProf.save();
        }

        for(const postId of profileToDelete.posts ){
            const post = await Post.findById(postId);
            await Comment.deleteMany({ _id: { $in: post.comments } });
            post.comments = [];
            post.likes = [];
            await post.save(); 
            await Post.findByIdAndDelete(postId);
        }
        next();
    }
)

const protect = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return next(new AppError('Not authorized, no token', 401, 'error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;  
        next();
    } catch (error) {
        return next(new AppError('Not authorized, token failed', 401, httpStatus.Error));
    }
};




module.exports = {
    foundUser,
    passwordEncryption,
    checkInputAndPassword,
    checkAuthorization,
    protect,    
    checkInput,
    deleteUser
};
