const express = require('express');
const authMiddleware = require('../../../middlewares/authMiddleware');
const expertController = require('../../../controllers/API/expert/expertController');
const { upload } = require('../../../config/aws-bucket');
const protectedRouter = express.Router();
protectedRouter.use(authMiddleware);



protectedRouter.post('/create-pin', expertController.create_pin);
protectedRouter.post('/pin-login', expertController.pin_login);
protectedRouter.post('/update-document', upload.single('document_file'), expertController.update_document);
protectedRouter.post('/setup-profile', expertController.setup_profile);
protectedRouter.get('/get-user', expertController.get_user);
protectedRouter.get('/task', expertController.task);
protectedRouter.get('/task-details', expertController.task_details);
protectedRouter.post('/expert-slots', expertController.expert_slots);
protectedRouter.get('/task-analytics', expertController.task_analytics);
protectedRouter.get('/today-appointment', expertController.today_appointment);
protectedRouter.post('/add-bank-account', expertController.add_bank_account);
protectedRouter.get('/get-bank-account', expertController.get_bank_account);


module.exports = protectedRouter;