const express = require('express');

const router = express.Router();

const userControllers = require('../controllers/userController');
const { signUpValidation } = require('../helpers/validation');

router.route('/').post(signUpValidation, userControllers.register);

module.exports = router;
