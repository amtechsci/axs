const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/web/adminController');
const { upload } = require('../../config/aws-bucket');

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
router.post('/file-upload', upload.single('file'), adminController.file_upload);
router.post('/files-upload', upload.array('document_file',5), adminController.files_upload);
router.post('/add-user', adminController.add_user);
router.post('/add-experience', adminController.add_experience);
router.get('/experiences', adminController.experiences);
router.get('/getsubcat', adminController.getsubcat);

module.exports = router;