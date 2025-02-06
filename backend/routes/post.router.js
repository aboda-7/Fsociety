const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/post.middleware');
const postControllers = require('../controllers/post.controllers');
const {protect} = require('../middleware/auth.middleware');

router.route('/createPost')
    .post(protect, middleWare.createPost, postControllers.createPost);

module.exports = router;