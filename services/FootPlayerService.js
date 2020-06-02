const FootPlayerUtility = require('../db/utilities/FootPlayerUtility');
const LoginUtility = require('../db/utilities/LoginUtility');
const MEMBER = require('../constants/MemberType');
const PROFILE_STATUS = require('../constants/ProfileStatus');
const FOOTPLAYER_STATUS = require('../constants/FootPlayerStatus');
const FootPlayerSearchListResponseMapper = require("../dataModels/responseMapper/FootPlayerSearchListResponseMapper");
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const _ = require("lodash");
const PlayerUtility = require('../db/utilities/PlayerUtility');
const errors = require("../errors");
const EmailService = require('./EmailService');
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtility');

class FootPlayerService {

    constructor() {
        this.footPlayerUtilityInst = new FootPlayerUtility();
        this.loginUtilityInst = new LoginUtility();
        this.playerUtilityInst = new PlayerUtility();
        this.emailService = new EmailService();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();
    }

    /**
     * get list of players
     *
     * @param {*} [requestedData={}]
     * @returns 
     * @memberof FootPlayerService
     */
    async getPlayersList(requestedData = {}) {
        try {
            let filterConditions = this._prepareFilterCondition(requestedData.filterConditions)
            let data = await this.loginUtilityInst.aggregate([{ $match: { profile_status: PROFILE_STATUS.VERIFIED, is_deleted: false, member_type: MEMBER.PLAYER } },
            { $project: { user_id: 1, _id: 0 } }, { "$lookup": { "from": "player_details", "localField": "user_id", "foreignField": "user_id", "as": "player_detail" } }, { $unwind: { path: "$player_detail" } },
            { $project: { user_id: "$player_detail.user_id", email: "$player_detail.email", first_name: "$player_detail.first_name", last_name: "$player_detail.last_name", position: "$player_detail.position", player_type: "$player_detail.player_type", avatar_url: "$player_detail.avatar_url", phone: "$player_detail.phone" } },
            { "$lookup": { "from": "foot_players", "localField": "user_id", "foreignField": "send_to.user_id", "as": "footplayerDocument" } },
            { $project: { user_id: 1, first_name: 1, last_name: 1, position: 1, player_type: 1, phone: 1, email: 1, avatar_url: 1, filteredfootplayerDocument: { $filter: { input: "$footplayerDocument", as: "element", cond: { $and: [{ $ne: ["$$element.sent_by", requestedData.user_id] }, { $eq: ["$$element.status", FOOTPLAYER_STATUS.ADDED] }, { $eq: ["$$element.is_deleted", false] }] } } } } },
            { $unwind: { path: "$filteredfootplayerDocument", preserveNullAndEmptyArrays: true } },
            { "$lookup": { "from": "club_academy_details", "localField": "filteredfootplayerDocument.sent_by", "foreignField": "user_id", "as": "SentBy" } },
            { $project: { user_id: 1, first_name: 1, last_name: 1, position: 1, phone: 1, player_type: 1, email: 1, avatar_url: 1, club: { $filter: { input: "$SentBy", as: "element", cond: { $eq: ["$$element.member_type", MEMBER.CLUB] } } } } },
            { $unwind: { path: "$club", preserveNullAndEmptyArrays: true } },
            { $project: { user_id: 1, first_name: 1, last_name: 1, position: 1, phone: 1, player_type: 1, email: 1, avatar_url: 1, club_name: "$club.name" } },
            { $match: filterConditions }]);
            data = new FootPlayerSearchListResponseMapper().map(data);
            return { total: data.length, data: data };
        } catch (e) {
            console.log("Error in getPlayerList() of FootPlayerService", e);
            return Promise.reject(e);
        }
    }

    /**
     * prepare filter condition for player
     *
     * @param {*} [filterConditions={}]
     * @returns
     * @memberof FootPlayerService
     */
    _prepareFilterCondition(filterConditions = {}) {
        let condition = {};
        let filterArr = []
        if (filterConditions) {
            if (filterConditions.email) {
                filterArr.push({ email: new RegExp(filterConditions.email, 'i') })
            }
            if (filterConditions.first_name) {
                filterArr.push({ first_name: new RegExp(filterConditions.first_name, 'i') })
            }
            if (filterConditions.last_name) {
                filterArr.push({ last_name: new RegExp(filterConditions.last_name, 'i') })
            }
            if (filterConditions.phone) {
                filterArr.push({ phone: new RegExp(filterConditions.phone, 'i') })
            }
            condition = {
                $and: filterArr
            }
        }
        return filterArr.length ? condition : {}
    }

    async sendFootplayerRequest(requestedData = {}) {
        try {
            await this.sendFootplayerRequestValidator(requestedData);
            let send_to_data = await this.playerUtilityInst.findOne({ user_id: requestedData.send_to }, { first_name: 1, last_name: 1, phone: 1, email: 1, _id: 0 });
            await this.footPlayerUtilityInst.insert({
                sent_by: requestedData.sent_by,
                send_to: { user_id: requestedData.send_to, f_name: send_to_data.first_name, l_name: send_to_data.last_name, email: send_to_data.email, phone: send_to_data.phone }
            });
            let sent_by_data = await this.clubAcademyUtilityInst.findOne({ user_id: requestedData.sent_by }, { name: 1, member_type: 1, _id: 0 });
            this.emailService.footplayerRequest(send_to_data.email, { member_type: sent_by_data.member_type, name: sent_by_data.name });
            return Promise.resolve();
        } catch (e) {
            console.log("Error in sendFootplayerRequest() of FootPlayerService", e);
            return Promise.reject(e);
        }
    }

    async sendFootplayerRequestValidator(requestedData = {}) {
        if (requestedData.send_to === requestedData.sent_by) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_SEND_FOOTPLAYER_REQUEST_TO_YOURSELF));
        }
        if (requestedData.send_to) {
            let to_be_footplayer = await this.loginUtilityInst.findOne({ user_id: requestedData.send_to, member_type: MEMBER.PLAYER });
            if (_.isEmpty(to_be_footplayer)) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.MEMBER_TO_BE_FOOTPLAYER_NOT_FOUND));
            }
        }
        let data = await this.footPlayerUtilityInst.findOne({
            sent_by: requestedData.sent_by,
            "send_to.user_id": requestedData.send_to, status: FOOTPLAYER_STATUS.ADDED
        });
        if (!_.isEmpty(data)) {
            return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ALREADY_FOOTPLAYER));
        }
        return Promise.resolve();
    }
}

module.exports = FootPlayerService;