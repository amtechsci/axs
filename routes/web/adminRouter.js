const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/web/adminController');

// User Routes
router.get('/login', adminController.login);
router.post('/login', adminController.login);
router.get('/', adminController.index);
router.get('/user-roles', adminController.user_roles);
router.post('/set-roles', adminController.set_roles);
router.get('/customers', adminController.customers);
router.get('/experts', adminController.experts);
router.get('/employees', adminController.employees);
router.get('/partners', adminController.partners);
router.get('/categories', adminController.categories);
router.get('/expert-categories', adminController.expert_categories);
router.get('/subscriptions', adminController.subscriptions);

module.exports = router;