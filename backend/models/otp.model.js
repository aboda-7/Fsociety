const mongoose = require('mongoose');
const User = require('./user.model');

const otpSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId,ref : "User", required :true},
    otp : {type : String , required : true},
    createdAt : {type : Date , default : Date.now , expires : 1 * 60},
});

const Otp = mongoose.model("Otp",otpSchema);

module.exports = Otp;