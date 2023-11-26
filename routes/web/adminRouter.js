const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/web/adminController');

// User Routes
router.get('/login', adminController.login);
router.post('/login', adminController.login);
router.get('/', adminController.index);
router.get('/user-roles', adminController.user_roles);



module.exports = router;