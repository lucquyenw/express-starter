let clients = [];
let facts = [];
exports.eventsHandler = (req, res, next) => {
	const headers = {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
	};

	res.writeHead(200, headers);

	const data = `data: ${JSON.stringify(facts)}\n\n`;

	res.write(data);

	const clientId = Date.now();

	const newClient = {
		id: clientId,
		res,
	};

	clients.push(newClient);

	req.on('close', () => {
		console.log(`${clientId} Connection closed`);
		clients = clients.filter((client) => client.id !== clientId);
	});
};

const sendEventsToAll = (newFact) => {
	clients.forEach((client) => {
		client.res.write(`data: ${JSON.stringify(newFact)}\n\n`);
	});
};

exports.addFact = async (req, res, next) => {
	const newFact = req.body;
	facts.push(newFact);
	res.json(newFact);
	return sendEventsToAll(newFact);
};
