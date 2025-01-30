const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/user.middleware');
const userControllers = require('../controllers/user.controllers');
router.route('/signUp')
    .post(middleWare.foundUser,middleWare.passwordEncryption,userControllers.signUp);

router.route('/signIn')
    .post(middleWare.checkInput,userControllers.signIn);

module.exports = router;