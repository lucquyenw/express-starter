const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/customError');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = asyncErrorHandler(async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new CustomError('missing input field', 500, errors.array());
	}

	const { name, email, password } = req.body;
	const user = new User(name, email, password);
	const isAccountExist = await user.checkEmailIsExist(user);
	if (isAccountExist) {
		throw new CustomError('Email is already used', 409);
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		const newUser = await user.createUser();

		res.status(401).json({ message: 'account created successfully' });
	} catch (error) {
		throw new CustomError(error, 500);
	}
});
