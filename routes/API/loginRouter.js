const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/API/loginController');

// User Routes
router.post('/user/login', loginController.login);
router.post('/user/otp', loginController.otp);



module.exports = router;