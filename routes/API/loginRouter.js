const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/API/user/loginController');

// User Routes
router.post('/login', loginController.login);
router.post('/otp', loginController.otp);



module.exports = router;