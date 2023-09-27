const LoginSchema = require("../schemas/LoginSchema");
const BaseUtility = require("./BaseUtility");

class LoginUtility extends BaseUtility {
	constructor() {
		super(LoginSchema);
	}	
}

module.exports = LoginUtility;