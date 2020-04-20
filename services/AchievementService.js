const BaseService = require("./BaseService");
const _ = require("lodash");
const AchievementUtility = require("../db/utilities/AchievementUtility");
const AchievementListResponseMapper = require("../dataModels/responseMapper/AchievementListResponseMapper");
const errors = require("../errors");

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
			if (achievement.year) {
				let msg = null;
				let d = new Date();
				let currentYear = d.getFullYear();

				if (achievement.year > currentYear) {
					msg = "year is greater than " + currentYear
				}
				if (achievement.year < 1970) {
					msg = "year is less than 1970"
				}
				if (achievement.year < 0) {
					msg = "year cannot be negative"
				}
				if (achievement.year == 0) {
					msg = "year cannot be zero"
				}
				if (msg) {
					return Promise.reject(new errors.ValidationFailed(msg));
				}
			}
			achievement.user_id = requestedData.user_id;
			await this.achievementUtilityInst.insert(achievement)
			Promise.resolve();
		} catch (e) {
			console.log("Error in add() of AchievementService", e);
			return e;
		}
	}
	async edit(requestedData = {}) {
		try {
			let foundAchievement = await this.achievementUtilityInst.findOne({ id: requestedData.id })
			if (!foundAchievement) {
				return Promise.reject(new errors.NotFound("Achievement not found"));
			}
			let achievement = requestedData.reqObj;
			if (achievement.year) {
				let msg = null;
				let d = new Date();
				let currentYear = d.getFullYear();

				if (achievement.year > currentYear) {
					msg = "year is greater than " + currentYear
				}
				if (achievement.year < 1970) {
					msg = "year is less than 1970"
				}
				if (achievement.year < 0) {
					msg = "year cannot be negative"
				}
				if (achievement.year == 0) {
					msg = "year cannot be zero"
				}
				if (msg) {
					return Promise.reject(new errors.ValidationFailed(msg));
				}
			}
			achievement.user_id = requestedData.user_id;
			let response = await this.achievementUtilityInst.updateOne({ id: requestedData.id }, achievement)
			return response;
		} catch (e) {
			console.log("Error in edit() of AchievementService", e);
			return e;
		}
	}
	async delete(id) {
		try {
			let foundAchievement = await this.achievementUtilityInst.findOne({ id: id })
			if (foundAchievement) {
				let date = Date.now()
				await this.achievementUtilityInst.findOneAndUpdate({ id: id }, { is_deleted: true, deleted_at: date })
				return Promise.resolve()
			}
			throw new errors.NotFound("Achievement not found");
		} catch (e) {
			console.log("Error in delete() of AchievementService", e);
			return Promise.reject(e);
		}
	}
}

module.exports = AchievementService;

