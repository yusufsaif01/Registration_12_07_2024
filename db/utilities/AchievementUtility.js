const AchievementSchema = require("../schemas/ActivitySchema");
const BaseUtility = require("./BaseUtility");

class AchievementUtility extends BaseUtility {
	constructor() {
		super(AchievementSchema);
	}	
}

module.exports = AchievementUtility;