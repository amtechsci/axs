const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/API/loginController');

// User Routes
router.post('/login', loginController.login);
router.post('/otp', loginController.otp);



module.exports = router;