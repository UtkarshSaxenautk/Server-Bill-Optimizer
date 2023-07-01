const express = require('express');
const router = express.Router();
const applianceController = require('../controllers/appliance');

router.post('/write', applianceController.writeAppliance);
router.post('/login', applianceController.readAppliance);

module.exports = router;
