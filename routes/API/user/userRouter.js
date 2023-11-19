const express = require('express');
const authMiddleware = require('../../../middlewares/authMiddleware');
const userController = require('../../../controllers/API/user/userController');
const categoryController = require('../../../controllers/API/user/categoryController');
const expertController = require('../../../controllers/API/user/expertController');
const { upload } = require('../../../config/aws-bucket');

const protectedRouter = express.Router();
protectedRouter.use(authMiddleware);

protectedRouter.post('/create-pin', userController.create_pin);
protectedRouter.post('/pin-login', userController.pin_login);
protectedRouter.post('/setup-profile', userController.setup_profile);
protectedRouter.post('/update-profile-image', upload.single('profile_img'), userController.update_profile_image);
protectedRouter.get('/category', categoryController.category);
protectedRouter.get('/expert-category', categoryController.expert_category);
protectedRouter.post('/add-preferences', userController.add_preferences);
protectedRouter.get('/get-user', userController.get_user);
protectedRouter.get('/notification', categoryController.notification);
protectedRouter.get('/get-subscription-plan', categoryController.get_subscription);
protectedRouter.get('/user-current-subscription', userController.user_current_subscription);
// protectedRouter.get('/buy-subscription', categoryController.buy_subscription);
// protectedRouter.get('/update-subscription', categoryController.update_subscription);
// protectedRouter.post('/cancel-subscription', categoryController.cancel_subscription);
protectedRouter.get('/recommendations', categoryController.recommendations);
protectedRouter.get('/recommendation-details', categoryController.recommendation_details);
protectedRouter.get('/task', categoryController.task);
protectedRouter.get('/task-details', categoryController.task_details);
protectedRouter.get('/booking', categoryController.booking);
protectedRouter.get('/booking-details', categoryController.booking_details);
protectedRouter.get('/expert-list', expertController.expert_list);
protectedRouter.get('/expert-profile', expertController.expert_profile);
protectedRouter.get('/expert-chat', expertController.expert_chat);
protectedRouter.post('/expert-send-message', expertController.expert_message);
protectedRouter.post('/add-expert-review', expertController.add_review);
protectedRouter.get('/bot-chat-list', expertController.bot_chat_list);
protectedRouter.get('/bot-chat-history', expertController.bot_chat_history);

module.exports = protectedRouter;