const express = require('express');
const postControllers = require('../controllers/postControllers');
const { createNewPostValidation } = require('../helpers/post.validation');
const router = express.Router();

// @route GET && POST - /posts/
router
	.route('/')
	.get(postControllers.getAllPosts)
	.post(createNewPostValidation, postControllers.createNewPost);
router.route('/:id').get(postControllers.getPostById);

module.exports = router;
