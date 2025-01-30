const asyncWrapper = require('./async.wrapper');
const AppError = require('../utils/app.error');
const httpStatus = require('../utils/http.status');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const sanitize = require('mongo-sanitize');
const validator = require('validator');


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
    const encryptedPassword = await bcrypt.hash(password,10);
    req.body.password = encryptedPassword;
    next();
});

const checkInput = asyncWrapper(async (req, res, next) => {
    let {input, password} = sanitize(req.body);
    password = String(password);
    let user;
    if (validator.isEmail(input)) {
        user = await User.findOne({ email : input }); // Find user by email
    } else {
        user = await User.findOne({ userName: input }); // Find user by username
    }
    // If no user is found
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordMatch) {
        const error = AppError.create("User not found", 404 , httpStatus.Error);
        return next(error);
    }

    next();
});
module.exports = {
    foundUser,
    passwordEncryption,
    checkInput
};
