const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/profile.middleware');
const profileControllers = require('../controllers/profile.conrtrollers');
const {protect} = require('../middleware/auth.middleware');


router.route('/changePassword/:email')
    .patch(protect,middleWare.checkPassword, profileControllers.changePassword);

router.route('/promoteUser/:userName')
    .patch(protect,middleWare.isOwner, middleWare.promoteUser, profileControllers.promoteUser);

router.route('/demoteUser/:userName')
    .patch(protect,middleWare.isOwner, middleWare.demoteUser, profileControllers.demoteUser);

router.route('/follow')
    .post(middleWare.followUser);
module.exports = router;