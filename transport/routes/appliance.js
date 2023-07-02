const express = require('express');
const router = express.Router();
const applianceController = require('../controllers/appliance');

router.post('/write', applianceController.writeAppliance);
router.get('/read/:name', applianceController.readAppliance);

module.exports = router;
