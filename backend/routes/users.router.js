const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/user.middleware');
const userControllers = require('../controllers/user.controllers');

router.route('/signUp')
    .post(middleWare.foundUser,middleWare.passwordEncryption,userControllers.signUp);

router.route('/signIn')
    .post(middleWare.checkInput,userControllers.signIn);

router.route('/deleteUser/:email')
    .delete(middleWare.protect,middleWare.checkAuthorization,userControllers.deleteUser);

router.route('/signOut')
    .get(userControllers.signOut);

    router.route('/changePassword/:email')
    .patch(middleWare.protect, userControllers.changePassword);

module.exports = router;