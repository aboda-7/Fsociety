const User = require('../models/user.model');
const httpStatus = require('../utils/http.status');
const asyncWrapper = require('../middleware/async.wrapper');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const validate = require('validator');
const AppError = require('../utils/app.error');
const bcrypt = require('bcrypt');
const cookieAdd = require('../utils/cookies')
const {generateToken} = require('../utils/jwt.token');
const {userFind} = require('../utils/user.find');
const Token = require('../models/token.model');
const {saveToken} = require('../utils/jwt.token');
const sendOTP = require('../utils/mailer');
const Otp = require('../models/otp.model');
const Profile = require('../models/profile.model');

const signUp = asyncWrapper(
    async (req,res) => {
        const newUser = new User(sanitize(req.body));
        await newUser.save();
        await Profile.create({user : newUser.id});
        return res.status(201).json({status : httpStatus.Success , data : {message : "User created successfully"},"userName" : newUser.userName});
    }
)

const signIn = asyncWrapper(
    async (req, res,next) => {
        const {input, password} = sanitize(req.body);
        const user = await userFind(input);
        req.user = user;
        const accessToken = await generateToken({id : user._id , role : user.role}, process.env.ACCESS_SECRET, '5m');
        const refreshToken = await generateToken({id : user._id , role : user.role}, process.env.REFRESH_SECRET, '7d');
        await saveToken(res,refreshToken, user._id);
        return res.status(200).json({status : httpStatus.Success , data : {token : accessToken}, "userName" : user.userName});
    }
)

const deleteUser = asyncWrapper(
    async (req,res, next) => {
        const {email} = sanitize(req.params);
        const userToDelete = await User.findOne({email});
        const profileToDelete = await Profile.findOne({user : userToDelete.id});
        await userToDelete.deleteOne();
        await profileToDelete.deleteOne();
        return res.status(200).json({status: httpStatus.Success,data : {message: 'User deleted successfully'}});
    }
)

const generateAndStoreOTP = asyncWrapper(async (req, res, next) => {
    const user = req.user; 
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const sent = await sendOTP(user.email, otp); // Await the sendOTP function
        const hashedOTP = await bcrypt.hash(otp, 10);

        if (sent) {
            await Otp.create({ userId: user._id, otp: hashedOTP });
            req.userId = user._id;
            return res.status(200).json({ status: http.Success, data: { message: "OTP sent successfully" } });
        } else {
            const error = AppError.create("Email not sent, try again", 500, httpStatus.Fail);
            return next(error);
        }
    } catch (err) {
        const error = AppError.create(err.message, 500, httpStatus.Fail);
        return next(error);
    }
});

const getUser= asyncWrapper(
    async(req,res,next)=>{
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
            "profile picture" : profile.profilePicture,
             }});
    }
)

const getUserById= asyncWrapper(
    async(req,res,next)=>{
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
            "profile picture" : profile.profilePicture,
             }});
    }
)

module.exports = {
    signUp,
    signIn,
    deleteUser,
    generateAndStoreOTP,
    getUser,
    getUserById
}

