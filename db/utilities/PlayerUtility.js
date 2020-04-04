const PlayerSchema = require("../schemas/PlayerSchema");
const BaseUtility = require("./BaseUtility");

class UserUtility extends BaseUtility {
	constructor() {
		super(PlayerSchema);
	}	
}

module.exports = PlayerUtility;