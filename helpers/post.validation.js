const { check } = require('express-validator');

exports.createNewPostValidation = [
	check('title', 'Title is required').not().isEmpty(),
	check('body', 'Body is required').not().isEmpty(),
];
