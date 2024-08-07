const db = require('../config/db');

class Post {
	constructor(title, body) {
		this.title = title;
		this.body = body;
	}

	async save() {
		let sql = `INSERT INTO posts(title, body) VALUES (:title, :body)`;
		const [newPost, _] = await db.execute(sql, {
			title: this.title,
			body: this.body,
		});

		return newPost;
	}

	static findAll() {
		let sql = `SELECT * FROM posts`;
		return db.execute(sql);
	}

	static findOne(id) {
		let sql = `SELECT * FROM posts WHERE id = :id`;
		return db.execute(sql, { id });
	}
}

module.exports = Post;
