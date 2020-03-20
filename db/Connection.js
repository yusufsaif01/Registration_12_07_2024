const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

class Connection {
	async connectDB({ host, name }) {
		let url = host + name;
		this.dbConnection = await this.connectMongoDB(url);
		return this.dbConnection;
	}

	disconnectDB() {
		return mongoose.connection.close();
	}

	async connectMongoDB(mongoDbURL, options = {}) {
		try {
			this.attachEvents();
			options.useCreateIndex = true;
			return mongoose.connect(mongoDbURL, options);
		} catch (err) {
			console.error({ err }, "Error in mongo DB connection.");
			throw err;
		}
	}

	attachEvents() {
		let connection = mongoose.connection;
		connection.on("connected", () => {
			console.log("DB Connected");
		});

		connection.on("disconnected", (err) => {
			console.log("DB disconnected", err);
		});

		connection.on("close", () => {
			console.log("DB connection close");
		});

		connection.on("reconnected", () => {
			console.log("DB reconnected");
		});

		connection.on("reconnected", () => {
			console.log("DB reconnected");
		});

		connection.on("error", (err) => {
			console.log("DB connection error", err);
		});
	}
}

module.exports = new Connection;

