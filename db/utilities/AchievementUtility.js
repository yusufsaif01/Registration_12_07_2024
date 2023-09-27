const AchievementSchema = require("../schemas/AchievementSchema");
const BaseUtility = require("./BaseUtility");

class AchievementUtility extends BaseUtility {
	constructor() {
		super(AchievementSchema);
	}
}

module.exports = AchievementUtility;