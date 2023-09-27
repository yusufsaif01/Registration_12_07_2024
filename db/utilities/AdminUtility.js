const AdminSchema = require("../schemas/AdminSchema");
const BaseUtility = require("./BaseUtility");

class AdminUtility extends BaseUtility {
	constructor() {
		super(AdminSchema);
	}	
}

module.exports = AdminUtility;