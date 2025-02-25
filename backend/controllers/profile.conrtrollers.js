const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const httpStatus = require('../utils/http.status');
const asyncWrapper = require('../middleware/async.wrapper');
const sanitize = require('mongo-sanitize');
const AppError = require('../utils/app.error');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const changePassword = asyncWrapper(
    async (req, res, next) => {
        const { email } = sanitize(req.params); 
        const { passwordChanged } = sanitize(req.body);
        const user = await User.findOne({ email });
        const newEncryptedPassword = await bcrypt.hash(passwordChanged, 10);
        user.password = newEncryptedPassword;
        await user.save();
        return res.status(200).json({status: httpStatus.Success,data: { message: 'Password updated successfully' }
        });
    }
);

const promoteUser = asyncWrapper(
    async (req, res, next) => {
        const { userName } = sanitize(req.params);
        const user = await User.findOne({ userName });
        user.role = 'admin';
        await user.save();
        return res.status(200).json({status: httpStatus.Success,data: { message: 'User promoted successfully' } });
    }
);

const demoteUser = asyncWrapper(
    async (req, res, next) => {
        const { userName } = sanitize(req.params);
        const user = await User.findOne({ userName });
        user.role = 'user';
        await user.save();
        return res.status(200).json({status: httpStatus.Success,data: { message: 'User demoted successfully' } });
    }
);

const changeBio = asyncWrapper(
    async (req, res, next) => {
        const { bio } = sanitize(req.body); 
        const profile = await Profile.findOne({ user: req.user.id });
        profile.bio = bio;
        await profile.save();
        return res.status(200).json({ status: httpStatus.Success,data: { message: 'Bio updated successfully'},});
    }
);

const changeProfilePicture = asyncWrapper(
    async (req, res, next)=>{
        const { profilePicture} = sanitize(req.body);
        const profile = await Profile.findOne({ user : req.user.id});
        profile.profilePicture = profilePicture;
        await profile.save();
        return res.status(200).json({ status: httpStatus.Success,data: { message: 'profile Picture updated successfully'},});
    }
);

const follow = asyncWrapper(
    async (req, res, next) =>{
        const {userName} = sanitize(req.params);
        const toFollow = await User.findOne({userName});
        const followedProf = await Profile.findOne({user : toFollow._id});
        const user = sanitize(req.user.id);
        const userProf = await Profile.findOne({user});
        userProf.following.push(toFollow._id);
        await userProf.save();
        followedProf.followers.push(user);
        await followedProf.save();
        return res.status(200).json({status: httpStatus.Success,data:{massage : "user followed successfully"}});
    }
)

const unFollow = asyncWrapper(
    async (req, res, next)=>{
        const {userName} = sanitize(req.params);
        const toUnFollow = await User.findOne({userName});
        const unFollowedProf = await Profile.findOne({user : toUnFollow._id});
        const user = sanitize(req.user.id);
        const userProf = await Profile.findOne({user});
        userProf.following.pull(toUnFollow._id);
        await userProf.save();
        unFollowedProf.followers.pull(user);
        await unFollowedProf.save();
        return res.status(200).json({status: httpStatus.Success,data:{massage : "user unfollowed successfully"}});
    }
)

const getProfile = asyncWrapper(
    async(req, res, next)=>{
        const {userName} = sanitize(req.params); 
        const user = await User.findOne({userName});
        if(!user){
            const error = AppError.create("User not found", 404, httpStatus.Error);
            return next(error);
        } 
        const profile = await Profile.findOne({user : user._id});
        return res.status(200).json({status: httpStatus.Success,data : {
                    "first name" : user.firstName,
                    "last name" : user.lastName,
                    "username" : user.userName,
                    "role" : user.role,
                    "following" : user.followingCount,
                    "followers" : user.followersCount,
                    profile
                     }});
    }
)

const getProfileById = asyncWrapper(
    async(req, res, next)=>{
        const userId = sanitize(req.params.id); 
        const user = await User.findById(userId);
        if(!user){
            const error = AppError.create("User not found", 404, httpStatus.Error);
            return next(error);
        } 
        const profile = await Profile.findOne({user : userId});
        return res.status(200).json({status: httpStatus.Success,data : {
                    "first name" : user.firstName,
                    "last name" : user.lastName,
                    "username" : user.userName,
                    "role" : user.role,
                    "following" : user.followingCount,
                    "followers" : user.followersCount,
                    profile
                     }});
    }
)

module.exports = {
    changePassword,
    promoteUser,
    demoteUser,
    changeBio,
    changeProfilePicture,
    getProfile,
    follow,
    unFollow,
    getProfileById
};