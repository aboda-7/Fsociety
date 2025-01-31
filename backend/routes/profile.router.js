const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/profile.middleware');
const profileControllers = require('../controllers/profile.controllers');
const {protect} = require('../middleware/auth.middleware');


router.route('/changePassword/:email')
    .patch(protect, profileControllers.changePassword);

module.exports = router;