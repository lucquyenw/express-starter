require('dotenv').config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP
const CustomError = require('./utils/customError');
const globalErrorHandler = require('./controllers/errorController');
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json()); // parse json bodies in the request object
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Redirect requests to endpoint starting with /posts to postRoutes.js
app.use('/posts', require('./routes/postRoutes'));
app.use('/events', require('./routes/eventRoutes'));
app.use('/uploadFile', require('./routes/uploadFileRoutes'));
app.use('/register', require('./routes/userRoutes'));

app.all('*', (req, res, next) => {
	const err = new CustomError(
		`Can't find ${req.originalUrl} on the server!`,
		404
	);

	next(err);
});

// Global Error Handler. IMPORTANT function params MUST start with err
app.use(globalErrorHandler);

// Listen on pc port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
