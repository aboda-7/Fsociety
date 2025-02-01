const User = require('../models/user.model');
const validate = require('validator');

const userFind = async (input) => {
    let user;
    input = String(input);
    if (validate.isEmail(input)) {
        user = await User.findOne({ email : input }); // Find user by email
    } else {
        user = await User.findOne({ userName: input }); // Find user by username
    }
    return user;
};

module.exports = {userFind};