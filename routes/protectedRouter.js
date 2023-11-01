const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const apiController = require('../controllers/apiController');
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



protectedRouter.post('/create-pin', apiController.create_pin);
// protectedRouter.post('/forgot-pin', apiController.forgot_pin);
protectedRouter.post('/setup-profile', apiController.setup_profile);
protectedRouter.post('/update-profile-image', upload.single('profile_img'), apiController.update_profile_image);
protectedRouter.get('/category', apiController.category);
protectedRouter.post('/add-preferences', apiController.add_preferences);
protectedRouter.get('/notification', apiController.notification);
protectedRouter.get('/get-subscription', apiController.get_subscription);
// protectedRouter.get('/buy-subscription', apiController.buy_subscription);
// protectedRouter.get('/update-subscription', apiController.update_subscription);
// protectedRouter.post('/cancel-subscription', apiController.cancel_subscription);
protectedRouter.get('/recommendations', apiController.recommendations);
protectedRouter.get('/recommendation-details', apiController.recommendation_details);

module.exports = protectedRouter;