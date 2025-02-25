const express = require('express');
const router = express.Router();
const userMiddleWare = require('../middleware/user.middleware');
const {checkRefreshToken} = require('../middleware/auth.middleware');
const userControllers = require('../controllers/user.controllers');
const {generateAndStoreOTP} = require('../controllers/user.controllers');

router.route('/signUp')
    .post(userMiddleWare.foundUser,userMiddleWare.passwordEncryption,userControllers.signUp);

router.route('/signIn')
    .post(userMiddleWare.checkInputAndPassword,userControllers.signIn);

router.route('/deleteUser/:email')
    .delete(userMiddleWare.protect,userMiddleWare.checkAuthorization,
        userMiddleWare.deleteUser, userControllers.deleteUser);

router.route('/forgetPassword')
    .post(userMiddleWare.checkInput,generateAndStoreOTP);

router.route('/getUser/:userName')
    .get(userMiddleWare.protect, userControllers.getUser);

router.route('/getUserById/:id')
    .get(userMiddleWare.protect, userControllers.getUserById);

module.exports = router;
