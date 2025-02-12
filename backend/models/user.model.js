const mongoose = require('mongoose');
const validator = require('validator');
const appError = require('../utils/app.error');

const UserSchema = new mongoose.Schema({
    firstName: {   
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },  
    followersCount :{
        type : Number, 
        default : 0
    },
    followingCount :{
        type : Number, 
        default : 0
    }
});

module.exports = mongoose.model('User', UserSchema);