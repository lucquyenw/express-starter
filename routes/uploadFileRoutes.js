const express = require('express');
const uploadFileController = require('../controllers/uploadFileController');

const router = express.Router();
const upload = require('../config/file');

router.route('/').post(uploadFileController.uploadFileSimple);
router.route('/singleFile').post(uploadFileController.uploadSingleFile);

module.exports = router;
