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

<<<<<<< HEAD
router.route('/follow')
    .post(middleWare.followUser);
=======
router.route('/changeBio')
    .patch(protect,middleWare.checkProfile, profileControllers.changeBio);

    router.route('/changeProfilePicture')
    .patch(protect,middleWare.checkProfile, profileControllers.changeProfilePicture);

>>>>>>> 34d39e17b6dbf46081174d44b02492cac731c85e
module.exports = router;