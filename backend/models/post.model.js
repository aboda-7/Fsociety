const mongoose = require('mongoose');
const appError = require('../utils/app.error');
const validator = require('validator');
const User = require('./user.model');
const comment = require('./comment.model');

const postSchema = new mongoose.Schema({
    publisher : {
       type : mongoose.Schema.Types.ObjectId , 
       ref : 'user' , 
       required : true
    },
    content: {
        type: String,
        required : true,
        maxLength: 1000
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        required: false
    }],
    date: {
        type: Date,
        default: Date.now
    },
    attachments: [{
        type: String,
        validate: {
            validator: function (value) {
                return /^(http|https):\/\/[^\s$.?#].[^\s]*(\.(jpg|jpeg|png|gif|webp|bmp|svg))$/i.test(value);
            },
            message: 'wrong picture format',
        },
    }],
});

module.exports = mongoose.model('post', postSchema);