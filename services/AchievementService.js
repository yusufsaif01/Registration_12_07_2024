const BaseService = require("./BaseService");
const _ = require("lodash");
const AchievementUtility = require("../db/utilities/AchievementUtility");
const AchievementListResponseMapper = require("../dataModels/responseMapper/AchievementListResponseMapper");

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
			console.log("Error in stats() of AchievementService", e);
			return err;
		}
	}
	async getList(requestedData = {}) {
		try {
			let response = {}, totalRecords = 0;
			let paginationOptions = requestedData.paginationOptions || {};
			let sortOptions = requestedData.sortOptions || {};
			let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
			let options = { limit: paginationOptions.limit, skip: skipCount, sort: {} };

			if (!_.isEmpty(sortOptions.sort_by) && !_.isEmpty(sortOptions.sort_order))
				options.sort[sortOptions.sort_by] = sortOptions.sort_order;

			totalRecords = await this.achievementUtilityInst.countList({ user_id: requestedData.user_id });
			let data = await this.achievementUtilityInst.find({ user_id: requestedData.user_id }, null, options);
			data = new AchievementListResponseMapper().map(data);
			response = {
				total: totalRecords,
				records: data
			}
			return response;
		} catch (e) {
			console.log("Error in getList() of AchievementService", e);
			return Promise.reject(e);
		}
	}
	async add(requestedData = {}) {
		try {
			let achievement = requestedData.reqObj;
			achievement.user_id=requestedData.user_id;
			this.achievementUtilityInst.insert(achievement)
		} catch (err) {
			console.log("Error in add() of AchievementService", e);
			return err;
		}
	}
}

module.exports = AchievementService;

