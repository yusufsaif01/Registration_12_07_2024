const PlayerSchema = require("../schemas/PlayerSchema");
const BaseUtility = require("./BaseUtility");

class PlayerUtility extends BaseUtility {
	constructor() {
		super(PlayerSchema);
	}	
}

module.exports = PlayerUtility;