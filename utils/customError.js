class CustomError extends Error {
	constructor(message, statusCode, errors) {
		super(message);
		this.statusCode = statusCode;
		this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

		this.isOperational = true;
		this.errorDetail = errors;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = CustomError;

//const error = new CustomError()
