const BaseService = require("./BaseService");
const AchievementUtility = require("../db/utilities/AchievementUtility");

class AchievementService extends BaseService {

	constructor() {
		super();
		this.achievementUtilityInst = new AchievementUtility();
	}

	async count(user_id) {
		try {
			let achievements = 0;
			achievements = await this.achievementUtilityInst.countList({ user_id: user_id });
			return { count: achievements };
		} catch (err) {
			return err;
		}
	}
}

module.exports = AchievementService;

