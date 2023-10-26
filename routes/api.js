const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

// User Routes
router.post('/user/login', apiController.login);
router.post('/user/otp', apiController.otp);

// router.post('/user/register', apiController.handleUserRegistration);
// router.get('/user/dashboard', apiController.displayUserDashboard);
// router.get('/services', apiController.displayAvailableServices);
// router.get('/services/:serviceId', apiController.displayServiceDetails);
// router.post('/services/:serviceId/book', apiController.bookService);
// router.get('/user/tasks', apiController.displayUserTasks);
// router.get('/user/tasks/:taskId', apiController.displayUserTaskDetails);
// router.get('/user/profile', apiController.displayUserProfile);
// router.post('/user/profile', apiController.updateUserProfile);
// router.get('/user/payment-methods', apiController.displayPaymentMethods);
// router.post('/user/payment-methods', apiController.updatePaymentMethod);
// router.get('/expert/register', apiController.displayExpertRegistrationForm);
// router.post('/expert/register', apiController.handleExpertRegistration);
// router.get('/expert/dashboard', apiController.displayExpertDashboard);
// router.get('/expert/tasks', apiController.displayExpertTasks);
// router.get('/expert/tasks/:taskId', apiController.displayExpertTaskDetails);
// router.get('/expert/profile', apiController.displayExpertProfile);
// router.post('/expert/profile', apiController.updateExpertProfile);
// router.get('/expert/earnings', apiController.displayExpertEarnings);
// router.post('/expert/withdraw', apiController.requestWithdrawal);

module.exports = router;