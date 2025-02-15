const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/post.middleware');
const postControllers = require('../controllers/post.controllers');
const {protect} = require('../middleware/auth.middleware');

router.route('/createPost')
    .post(protect, middleWare.postDataChecker, postControllers.createPost);

router.route('/editPost/:id')
    .patch(protect,middleWare.isPost, middleWare.editPost, 
        middleWare.postDataChecker , postControllers.editPost);

router.route('/likePost/:id')
    .patch(protect,middleWare.isPost, postControllers.likePost);

router.route('/addComment/:id')
    .patch(protect,middleWare.isPost, postControllers.addComment);
    
module.exports = router;