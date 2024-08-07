const express = require('express');
const eventControllers = require('../controllers/eventController');
const router = express.Router();

// @route GET && POST - /posts/
router
	.route('/')
	.get(eventControllers.eventsHandler)
	.post(eventControllers.addFact);

module.exports = router;
