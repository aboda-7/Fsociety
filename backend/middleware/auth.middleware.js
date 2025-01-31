const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/app.error');
const httpStatus = require('../utils/http.status');


const protect = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return next(new AppError('Not authorized, no token', 401, 'error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;  
        next();
    } catch (error) {
        return next(new AppError('Not authorized, token failed', 401, httpStatus.Error));
    }
};

module.exports = {
    protect
}
