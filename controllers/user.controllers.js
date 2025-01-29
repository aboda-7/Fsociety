const User = require('../models/user.model');
const httpStatus = require('../utils/http.status');
const signUp = async (req,res) => {
    const newUser = new User(req.body);
    console.log(newUser);
    const email = await User.findOne({email : newUser.email});
    if(email){
        console.log("found : " ,email);
        return res.status(400).json({status : httpStatus.Error , data : {message : "User already exists"}});
    }
    await newUser.save();
    return res.status(201).json({status : httpStatus.Success , data : {user : newUser}});
}

module.exports = {
    signUp
}