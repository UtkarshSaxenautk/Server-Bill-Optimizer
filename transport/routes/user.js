const express = require('express');
const router = express.Router();
const userController = require('../controllers/profile');
const authController = require('../controllers/auth');
const { sendHourlyReport } = require('../controllers/hourly');

router.put('/update', authController.authenticateToken, userController.updateUserProfile);
router.post('/hour',authController.authenticateToken ,sendHourlyReport )


module.exports = router;