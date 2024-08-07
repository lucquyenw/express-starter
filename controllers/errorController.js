const devErrors = (res, error) => {
	return res.status(error.statusCode).json({
		status: error.statusCode,
		message: error.message,
		stackTrace: error.stack,
		error: error,
		errorDetail: error.errors,
	});
};

const prodErrors = (res, error) => {
	if (error.isOperational) {
		return res.status(error.statusCode).json({
			status: error.statusCode,
			message: error.message,
		});
	} else {
		return res.status(500).json({
			status: 'error',
			message: 'something went wrong! please try again later',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		devErrors(res, err);
	} else if (process.env.NODE_ENV === 'production') {
		prodErrors(res, err);
	}
};
