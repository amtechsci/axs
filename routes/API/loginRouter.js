const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/API/loginController');

// User Routes
router.post('/login', loginController.login);
router.post('/otp', loginController.otp);
router.post('/forgot-pin', loginController.forgot_pin);
router.post('/forgot-pin-otp', loginController.forgot_pin_otp);



module.exports = router;