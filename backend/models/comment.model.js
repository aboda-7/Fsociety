const mongoose = require('mongoose');
const appError = require('../utils/app.error');
const validator = require('validator');
const User = require('./user.model');
const post = require('./post.model');

const commentSchema = new mongoose.Schema({
    writer : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'user' , 
        required : true
    },
    content: {
        type: String,
        required : true,
        maxLength: 500
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }],
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    }

})


module.exports = mongoose.model('comment', commentSchema);