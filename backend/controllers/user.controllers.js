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

const signUp = asyncWrapper(
    async (req,res) => {
        const newUser = new User(sanitize(req.body));
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


const changePassword = asyncWrapper(
    async (req, res, next) => {
        const { email } = sanitize(req.params); 
        const { prevPassword, passwordChanged } = sanitize(req.body);

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

        const newEncryptedPassword = await bcrypt.hash(passwordChanged, 10);
        user.password = newEncryptedPassword;

        await user.save();

        return res.status(200).json({status: httpStatus.Success,data: { message: 'Password updated successfully' }
        });
    }
);


const signOut= asyncWrapper(
    async (req,res) => {
        return res.status(200).json({status : httpStatus.Success , data : {message : "User signed out successfully"}});
    }
)

module.exports = {
    signUp,
    signIn,
    deleteUser,
    changePassword,
    signOut
}

