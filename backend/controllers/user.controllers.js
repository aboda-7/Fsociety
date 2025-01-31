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


const signUp = asyncWrapper(
    async (req,res) => {
        const newUser = new User(sanitize(req.body));
        await newUser.save();
        return res.status(201).json({status : httpStatus.Success , data : {message : "User created successfully"}});
    }
)

const signIn = asyncWrapper(
    async (req, res,next) => {
        const {input, password} = sanitize(req.body);
        const user = await userFind(input);
        const accessToken = await generateToken({id : user._id , role : user.role}, process.env.ACCESS_SECRET, '5m');
        const refreshToken = await generateToken({id : user._id , role : user.role}, process.env.REFRESH_SECRET, '7d');
        await cookieAdd(res , 'refreshToken' , refreshToken);
        return res.status(200).json({status : httpStatus.Success , data : {token : accessToken}});
    }
)

const deleteUser = asyncWrapper(
    async (req,res, next) => {
        const {email} = sanitize(req.params);
        const userToDelete = await User.findOne({email});
        await userToDelete.deleteOne();
        return res.status(200).json({status: httpStatus.Success,data : {message: 'User deleted successfully'}});
    }
)


module.exports = {
    signUp,
    signIn,
    deleteUser
}

