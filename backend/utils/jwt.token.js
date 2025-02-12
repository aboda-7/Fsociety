const jwt = require('jsonwebtoken');
const { cookieAdd } = require('./cookies');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

const saveToken = async (res,refreshToken, Id) => {
    try {
        const user = await User.findById(Id);
        const userId = new mongoose.Types.ObjectId(Id);
        const test = await Token.findOne({user : userId});
        await Token.deleteOne({ user: userId });
        const newRefreshToken = await generateToken({id : user._id , role : user.role}, process.env.REFRESH_SECRET, '7d');
        // cookieAdd(res, 'refreshToken', refreshToken);
        await Token.create({ token: newRefreshToken, user: userId });
    } catch (error) {
        console.error('Error saving token:', error);
        throw error; // Propagate the error to the caller
    }
};

module.exports = {
    generateToken,
    verifyToken,
    saveToken
};