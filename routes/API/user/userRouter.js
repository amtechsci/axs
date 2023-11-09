const express = require('express');
const authMiddleware = require('../../../middlewares/authMiddleware');
const userController = require('../../../controllers/API/user/userController');
const categoryController = require('../../../controllers/API/user/categoryController');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });
const protectedRouter = express.Router();
protectedRouter.use(authMiddleware);



protectedRouter.post('/create-pin', userController.create_pin);
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
protectedRouter.get('/expert-list', categoryController.expert_list);

module.exports = protectedRouter;