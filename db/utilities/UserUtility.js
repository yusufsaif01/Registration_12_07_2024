const UserSchema = require("../schemas/LoginSchema");
const BaseUtility = require("./BaseUtility");

class UserUtility extends BaseUtility {
	constructor() {
		super(UserSchema);
	}	
}

module.exports = UserUtility;