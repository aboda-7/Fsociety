const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/comment.middleware');
const commentControllers = require('../controllers/comment.controllers');
const {protect} = require('../middleware/auth.middleware');

router.route('/editComment/:id')
    .patch(protect, middleWare.isComment,middleWare.checkComment,
         middleWare.editorCheck, commentControllers.editComment);

module.exports = router;