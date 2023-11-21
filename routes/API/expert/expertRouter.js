const express = require('express');
const authMiddleware = require('../../../middlewares/authMiddleware');
const expertController = require('../../../controllers/API/expert/expertController');
const categoryController = require('../../../controllers/API/user/categoryController');
const { upload } = require('../../../config/aws-bucket');
const protectedRouter = express.Router();
protectedRouter.use(authMiddleware);



protectedRouter.post('/create-pin', expertController.create_pin);
protectedRouter.post('/pin-login', expertController.pin_login);
protectedRouter.post('/update-document', upload.array('document_file',5), expertController.update_document);
protectedRouter.post('/setup-profile', expertController.setup_profile);
protectedRouter.get('/get-user', expertController.get_user);
protectedRouter.get('/category', categoryController.category);
protectedRouter.get('/notification', categoryController.notification);
protectedRouter.get('/expert-category', categoryController.expert_category);
protectedRouter.get('/task', expertController.task);
protectedRouter.get('/task-details', expertController.task_details);
protectedRouter.post('/set-expert-slots', expertController.expert_slots);
protectedRouter.get('/get-expert-slots', expertController.get_expert_slots);
protectedRouter.get('/task-analytics', expertController.task_analytics);
protectedRouter.get('/today-appointment', expertController.today_appointment);
protectedRouter.post('/add-bank-account', expertController.add_bank_account);
protectedRouter.get('/get-bank-account', expertController.get_bank_account);
protectedRouter.get('/delete-bank-account', expertController.delete_bank_account);
protectedRouter.post('/edit-profile', expertController.edit_profile);
protectedRouter.get('/wallet', expertController.wallet);
protectedRouter.post('/withdraw-request', expertController.withdraw_request);
protectedRouter.get('/withdraw', expertController.withdraw);
protectedRouter.get('/user-chat', expertController.user_chat);
protectedRouter.post('/user-send-message', expertController.user_chat);


module.exports = protectedRouter;