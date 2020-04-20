const BaseService = require("./BaseService");
const AchievementUtility = require("../db/utilities/AchievementUtility");

class AchievementService extends BaseService {

	constructor() {
		super();
		this.achievementUtilityInst = new AchievementUtility();
	}

	async stats(user_id) {
		try {
			let achievementCount = 0, tournamentCount = 0;
			achievementCount = await this.achievementUtilityInst.countList({ user_id: user_id });
			let response = {
				achievements: achievementCount,
				tournaments: tournamentCount

			}
			return response;
		} catch (err) {
			return err;
		}
	}
}

module.exports = AchievementService;

