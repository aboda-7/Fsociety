const express = require('express');
const router = express.Router();
const userMiddleWare = require('../middleware/user.middleware');
const {checkRefreshToken} = require('../middleware/auth.middleware');
const userControllers = require('../controllers/user.controllers');
router.route('/signUp')
    .post(userMiddleWare.foundUser,userMiddleWare.passwordEncryption,userControllers.signUp);

router.route('/signIn')
    .post(userMiddleWare.checkInput,userControllers.signIn);

router.route('/deleteUser/:email')
    .delete(checkRefreshToken,userMiddleWare.protect,userMiddleWare.checkAuthorization,userControllers.deleteUser);

module.exports = router;
