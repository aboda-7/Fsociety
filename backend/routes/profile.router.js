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

router.route('/follow/:userName')
    .patch(protect, middleWare.follow, profileControllers.follow);

router.route('/unFollow/:userName')
    .patch(protect, middleWare.unFollow, profileControllers.unFollow);
        
router.route('/changeBio')
    .patch(protect,middleWare.checkProfile, profileControllers.changeBio);

router.route('/changeProfilePicture')
    .patch(protect,middleWare.checkProfile, profileControllers.changeProfilePicture);

router.route('/getProfile/:userName')
    .get(protect, profileControllers.getProfile);

module.exports = router;