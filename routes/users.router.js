const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user.controllers');

router.route('/signUp')
    .post(userControllers.signUp);

module.exports = router;