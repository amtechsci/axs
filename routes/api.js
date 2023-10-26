const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// User Routes
router.post('/user/login', apiController.login);
router.post('/user/otp', apiController.otp);



module.exports = router;