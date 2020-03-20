const Connection = require("./Connection");
const config = require("../config");

class DB {
	async connectDB() {

		let host = config.db.host;
		let dbName = config.db.name;
		let url = host + dbName;
		let options = config.db.options;
		if (config.db.is_auth_enable) {
			options.user = config.db.db_user;
			options.pass = config.db.db_pass;
			options.authSource = config.db.db_auth_source;
		}
		this.dbConnection = await Connection.connectMongoDB(url, options);
		return this.dbConnection;
	}
}

module.exports = new DB;

