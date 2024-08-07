const fs = require('fs');
const path = require('path');
const CustomError = require('../utils/customError');
const { formidable } = require('formidable');
const { Transform } = require('stream');
const csv = require('csvtojson');
const { pipeline } = require('stream/promises');

exports.uploadFileSimple = (req, res) => {
	// const filePath = path.join(__dirname, '/import.jpg');
	// const stream = fs.createWriteStream(filePath);

	// stream.on('open', () => req.pipe(stream));
	// stream.on('drain', () => {
	// 	const written = parseInt(stream.bytesWritten);
	// 	const total = parseInt(req.headers['content-length']);
	// 	const pWritten = ((written / total) * 100).toFixed(2);
	// 	console.log(`Processing ... ${pWritten}% done`);
	// });

	// stream.on('close', () => {
	// 	const msg = `Data uploaded to ${filePath}`;
	// 	console.log('Processing ... 100%');
	// 	console.log(msg);
	// 	res.status(200).send({ status: 'success', msg });
	// });

	// stream.on('error', () => {
	// 	console.log(err);
	// 	res.status(500).send({ status: 'error', err });
	// });

	copyCSVFile(res);
};

exports.uploadSingleFile = (req, res) => {
	const form = formidable({ multiples: true });

	form.parse(req, (error, fields, files) => {
		if (error) {
			throw error;
		}

		files.file.forEach((file) => {
			const fileName = encodeURIComponent(
				file.originalFilename.replace(/\s/g, '-')
			);

			const filePath = path.join(__dirname, '..', 'uploads', fileName);

			fs.copyFileSync(file.filepath, filePath);
			fs.unlinkSync(file.filepath);
		});
		return res.status(200).json({ message: 'File Uploaded' });
	});
};

class MyTransformStream extends Transform {
	constructor(options) {
		super(options);
	}

	// Implement the _transform method to modify data
	_transform(chunk, encoding, callback) {
		// Example transformation: Convert data to uppercase
		const user = {
			seq: Number(chunk.seq),
			firstName: chunk.first,
			last: chunk.last,
		};

		this.push(user);
		callback();
	}
}

class MyFilteringTransform extends Transform {
	constructor(options) {
		super(options);
	}

	// Implement the _transform method to modify data
	_transform(user, encoding, callback) {
		// Example transformation: Convert data to uppercase
		if (user.seq > 1000) {
			callback(null);
			return;
		}

		this.push(user);

		callback();
	}
}

class ConverToJSONTransform extends Transform {
	constructor(options) {
		super(options);
	}

	// Implement the _transform method to modify data
	_transform(user, encoding, callback) {
		// Example transformation: Convert data to uppercase
		const value = JSON.stringify(user) + '\n';
		this.push(value);

		callback();
	}
}

const copyCSVFile = async (res) => {
	const filePath = path.join(__dirname, '..', 'resources/export.csv');
	const readFilePath = path.join(__dirname, '..', 'resources/import.csv');
	const readStream = fs.createReadStream(readFilePath);
	const writeStream = fs.createWriteStream(filePath);

	const transformStream = new MyTransformStream({ objectMode: true });
	const filteringTransform = new MyFilteringTransform({ objectMode: true });
	const convertToJSOn = new ConverToJSONTransform({ objectMode: true });

	try {
		await pipeline(
			readStream,
			csv({ delimiter: ';' }, { objectMode: true }),
			transformStream,
			filteringTransform,
			convertToJSOn,
			res
		);

		console.log('completed');
	} catch (error) {
		res.end();
		console.log('streams ended with error: ', error);
	}
};
