const db = require('../config/db');

class User {
	constructor(name, email, password) {
		this.name = name;
		this.email = email;
		this.password = password;
	}

	async checkEmailIsExist() {
		let sql = `SELECT * FROM users WHERE LOWER(email) = LOWER(:email)`;
		const [user, _] = await db.execute(sql, {
			email: this.email,
		});

		return user && user.length > 0;
	}

	async createUser() {
		let sql = `INSERT INTO users(name, email,password) VALUES (:name, :email, :password)`;
		const [newUser, _] = await db.execute(sql, {
			name: this.name,
			email: this.email,
			password: this.password,
		});

		return newUser;
	}
}

module.exports = User;
