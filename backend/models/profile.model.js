const mongoose = require('mongoose');
const appError = require('../utils/app.error');
const validator = require('validator');
const User = require('./user.model');

const profileSchema = new mongoose.Schema({
    bio:{
        type : String,
        required: false,
        maxlength: 500,
        default: '',
    },
    profilePicture:{
        type : String,
        required : false,
        default: 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
        validate: {
            validator: function (value) {
                return /^(http|https):\/\/[^\s$.?#].[^\s]*(\.(jpg|jpeg|png|gif|webp|bmp|svg))$/i.test(value);
            },
            message: 'wrong picture format',
        },
    },
    user : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'user' , 
        required : true
    },
})

module.exports = mongoose.model('profile', profileSchema);