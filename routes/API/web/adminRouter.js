const express = require('express');
const router = express.Router();
const adminController = require('../../../controllers/web/adminController');

// User Routes
router.post('/login', adminController.login);



module.exports = router;