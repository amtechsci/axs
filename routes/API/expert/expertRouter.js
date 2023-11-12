const express = require('express');
const authMiddleware = require('../../../middlewares/authMiddleware');
const expertController = require('../../../controllers/API/expert/expertController');
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



protectedRouter.post('/create-pin', expertController.create_pin);
protectedRouter.post('/pin-login', expertController.pin_login);
protectedRouter.post('/setup-profile', expertController.setup_profile);
// protectedRouter.post('/update-profile-image', upload.single('profile_img'), expertController.update_profile_image);
protectedRouter.get('/task', expertController.task);
protectedRouter.get('/task-details', expertController.task_details);


module.exports = protectedRouter;