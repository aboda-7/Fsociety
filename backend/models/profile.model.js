const mongoose = require('mongoose');
const appError = require('../utils/app.error');
const validator = require('validator');

const profileSchema = new mongoose.Schema({
    bio:{
        type : String,
        required: false,
        default: '',
    },
    profilePicture:{
        type : String,
        required : false,
        default: '',
        validate: {
            validator: function (value) {
                return /^(http|https):\/\/[^\s$.?#].[^\s]*(\.(jpg|jpeg|png|gif|webp|bmp|svg))$/i.test(value);
            },
            message: 'wrong picture format',
        },
    },
    user : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'User' , 
        required : true
    },
})

module.exports = mongoose.model('profile', profileSchema);