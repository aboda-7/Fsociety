const express = require('express');
const router = express.Router();
const appError = require('../utils/app.error');
const cookie = require('cookie');
const Token = require('../models/token.model');
const {generateToken} = require('../utils/jwt.token');
const jwt = require('jsonwebtoken');
const httpStatus = require('../utils/http.status');
const {checkRefreshToken} = require('../middleware/auth.middleware');
const {saveToken} = require('../utils/jwt.token');
router.route('/')
    .post(checkRefreshToken,(req, res) => {
        const token = req.cookies.refreshToken;
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
            if(err){
                const error = appError.create("Invalid refresh token", 404, httpStatus.Error);
                return next(error);
            }
            const accessToken = generateToken({id : decoded.id , role : decoded.role}, process.env.ACCESS_SECRET, '5m');
            const RefreshToken = generateToken({id : decoded.id , role : decoded.role}, process.env.REFRESH_SECRET, '7d');
            saveToken(res,RefreshToken,decoded.id);
            return res.status(200).json({status : httpStatus.Success , data : {token : accessToken}});
        });

    });

module.exports = router;