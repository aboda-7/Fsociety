const User = require('../models/user.model');
const httpStatus = require('../utils/http.status');
const asyncWrapper = require('../middleware/async.wrapper');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const validate = require('validator');
const signUp = asyncWrapper(
    async (req,res) => {
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({status : httpStatus.Success , data : {message : "User created successfully"}});
    }
)

const signIn = asyncWrapper(
    async (req, res,next) => {
        let user;
        const {input, password} = sanitize(req.body);
        if (validate.isEmail(input)) {
            user = await User.findOne({ email : input }); // Find user by email
        } else {
            user = await User.findOne({ userName: input }); // Find user by username
        }
        console.log(user.role);
        const token = await jwt.sign({id : user._id , role : user.role}, process.env.JWT_SECRET);
        return res.status(200).json({status : httpStatus.Success , data : {token : token}});
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

const signOut= asyncWrapper(
    async (req,res) => {
        return res.status(200).json({status : httpStatus.Success , data : {message : "User signed out successfully"}});
    }
)

module.exports = {
    signUp,
    signIn,
    deleteUser,
    signOut
}

