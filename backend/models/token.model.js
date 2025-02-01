const mongoose = require('mongoose');
const User = require('./user.model');

const TokenSchema = new mongoose.Schema({
    token : {type : String , required : true},
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
    createdAt : {type : Date , default : Date.now , expires : '7d'},
});

module.exports = mongoose.model('Token',TokenSchema);