const Post = require('../models/Post');
const CustomError = require('../utils/customError');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { validationResult } = require('express-validator');

exports.getAllPosts = asyncErrorHandler(async (req, res, next) => {
	const [posts, _] = await Post.findAll();

	res.status(200).json({ data: posts });
});

exports.createNewPost = asyncErrorHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new CustomError('missing input field', 500, errors.array());
	}

	const { title, body } = req.body;

	const post = new Post(title, body);
	const result = await post.save();

	res.send(result);
});

exports.getPostById = asyncErrorHandler(async (req, res, next) => {
	const id = req.params.id;

	if (!id) {
		res.status(501).json({ message: 'invalid id' });
	}

	const [post, _] = await Post.findOne(id);

	if (!post || post?.length === 0) {
		const error = new CustomError('Post with that ID is not found', 404);
		return next(error);
	}

	res.status(200).json({ data: post });
});
