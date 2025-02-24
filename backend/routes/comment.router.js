const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/comment.middleware');
const commentControllers = require('../controllers/comment.controllers');
const {protect} = require('../middleware/auth.middleware');

router.route('/editComment/:id')
    .patch(protect, middleWare.isComment,middleWare.checkComment,
         middleWare.editorCheck, commentControllers.editComment);

router.route('/likeComment/:id')
    .patch(protect, middleWare.isComment, commentControllers.likeComment);

router.route('/deleteComment/:id')
    .delete(protect, middleWare.isComment, middleWare.deleteComment, commentControllers.deleteComment);

router.route('/getComment/:id')
    .get(protect, middleWare.isComment, commentControllers.getComment);

module.exports = router;