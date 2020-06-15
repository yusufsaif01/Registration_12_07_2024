const BaseService = require("./BaseService");
const _ = require("lodash");
const AchievementUtility = require("../db/utilities/AchievementUtility");
const AchievementListResponseMapper = require("../dataModels/responseMapper/AchievementListResponseMapper");
const errors = require("../errors");
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const PlayerUtility = require('../db/utilities/PlayerUtility')

class AchievementService extends BaseService {

	constructor() {
		super();
		this.achievementUtilityInst = new AchievementUtility();
		this.playerUtilityInst = new PlayerUtility();
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
			let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
			let options = { limit: paginationOptions.limit, skip: skipCount, sort: { year: -1 } };
			let projection = { type: 1, name: 1, year: 1, position: 1, media_url: 1, id: 1 }
			let data = await this.achievementUtilityInst.find({ user_id: requestedData.user_id }, projection, options);
			totalRecords = await this.achievementUtilityInst.countList({ user_id: requestedData.user_id });
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
			achievement.year = (achievement.year) ? new Date(achievement.year).getFullYear() : null;
			let dob = "", user = {};
			user = await this.playerUtilityInst.findOne({ user_id: requestedData.user_id }, { dob: 1 });
			dob = user ? (user.dob || "") : ""
			await this._validateYear(achievement.year, dob);
			achievement.user_id = requestedData.user_id;
			await this.achievementUtilityInst.insert(achievement)
			return Promise.resolve();
		} catch (e) {
			console.log("Error in add() of AchievementService", e);
			return Promise.reject(e);
		}
	}

	async edit(requestedData = {}) {
		try {
			let foundAchievement = await this.achievementUtilityInst.findOne({ id: requestedData.id, user_id: requestedData.user_id })
			if (!foundAchievement) {
				return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.ACHIEVEMENT_NOT_FOUND));
			}
			let achievement = requestedData.reqObj;
			achievement.year = (achievement.year) ? new Date(achievement.year).getFullYear() : null;
			let dob = "", user = {};
			user = await this.playerUtilityInst.findOne({ user_id: requestedData.user_id }, { dob: 1 });
			dob = user ? (user.dob || "") : ""
			await this._validateYear(achievement.year, dob);
			achievement.user_id = requestedData.user_id;
			await this.achievementUtilityInst.updateOne({ id: requestedData.id }, achievement)
			return Promise.resolve();
		} catch (e) {
			console.log("Error in edit() of AchievementService", e);
			return Promise.reject(e);
		}
	}

	async delete({ id, user_id }) {
		try {
			let foundAchievement = await this.achievementUtilityInst.findOne({ id: id, user_id: user_id })
			if (foundAchievement) {
				await this.achievementUtilityInst.findOneAndUpdate({ id: id }, { is_deleted: true, deleted_at: Date.now() })
				return Promise.resolve()
			}
			throw new errors.NotFound(RESPONSE_MESSAGE.ACHIEVEMENT_NOT_FOUND);
		} catch (e) {
			console.log("Error in delete() of AchievementService", e);
			return Promise.reject(e);
		}
	}

	async _validateYear(year, dob) {
		if (year) {
			let msg = null;
			let d = new Date();
			let currentYear = d.getFullYear();

			if (year > currentYear) {
				msg = RESPONSE_MESSAGE.YEAR_GREATER_THAN_CURRENT_YEAR;
			}
			if (year < 1970) {
				msg = RESPONSE_MESSAGE.YEAR_LESS_THAN_1970;
			}
			if (year < 0) {
				msg = RESPONSE_MESSAGE.YEAR_CANNOT_BE_NEGATIVE;
			}
			if (year == 0) {
				msg = RESPONSE_MESSAGE.YEAR_CANNOT_BE_ZERO;
			}
			if (year && dob !== "") {
				let dob_year = new Date(dob).getFullYear();
				if (year < dob_year)
					msg = RESPONSE_MESSAGE.YEAR_LESS_THAN_DOB
			}
			if (msg) {
				return Promise.reject(new errors.ValidationFailed(msg));
			}
			else
				return Promise.resolve();
		}
		else
			return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.YEAR_REQUIRED));
	}
}

module.exports = AchievementService;

