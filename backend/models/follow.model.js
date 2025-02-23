const mongoose = require('mongoose');
const User = require('./user.model');

const followSchema = new mongoose.Schema({
    follower :{
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User',
        required : true
    },
    followed : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',   
        required : true
    },
    createdAt : {
        type : Date,
        default: Date.now 
    }
});

followSchema.index({followed : 1 , follower : 1} , {unique : true});

module.exports = mongoose.model('Follow' , followSchema);