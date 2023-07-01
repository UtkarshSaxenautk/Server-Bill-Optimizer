const express = require('express');
const router = express.Router();
const userController = require('../controllers/profile');
const authController = require('../controllers/auth')

router.put('/update', authController.authenticateToken,userController.updateUserProfile);


module.exports = router;