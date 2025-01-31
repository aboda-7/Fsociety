const User = require('../models/user.model');
const httpStatus = require('../utils/http.status');
const asyncWrapper = require('../middleware/async.wrapper');
const sanitize = require('mongo-sanitize');
const AppError = require('../utils/app.error');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const changePassword = asyncWrapper(
    async (req, res, next) => {
        const { email } = sanitize(req.params); 
        const { prevPassword, passwordChanged } = sanitize(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            const error = AppError.create("User not found", 404, httpStatus.Error);
            return next(error); 
        }
        
        const passwordMatch = await bcrypt.compare(prevPassword, user.password);
        if (!passwordMatch) {
            const error = AppError.create("Incorrect previous password", 401, httpStatus.Error);
            return next(error);
        }

        const newEncryptedPassword = await bcrypt.hash(passwordChanged, 10);
        user.password = newEncryptedPassword;

        await user.save();

        return res.status(200).json({status: httpStatus.Success,data: { message: 'Password updated successfully' }
        });
    }
);

module.exports = {
    changePassword
};