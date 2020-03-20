const UserSchema = require("../schemas/UserSchema");
const BaseUtility = require("./BaseUtility");

class UserUtility extends BaseUtility {
	constructor() {
		super(UserSchema);
	}	
}

module.exports = UserUtility;