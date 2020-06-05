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
    async footplayerSearch(requestedData = {}) {
        try {
            let filterConditions = this._preparePlayerFilterCondition(requestedData.filterConditions)
            let data = await this.loginUtilityInst.aggregate([{ $match: { is_deleted: false, member_type: MEMBER.PLAYER } },
            { $project: { user_id: 1, profile_status: 1, _id: 0 } }, { "$lookup": { "from": "player_details", "localField": "user_id", "foreignField": "user_id", "as": "player_detail" } }, { $unwind: { path: "$player_detail" } },
            { $project: { player_detail: { user_id: 1, email: 1, first_name: 1, last_name: 1, is_verified: { $cond: { if: { $eq: ["$profile_status", PROFILE_STATUS.VERIFIED] }, then: true, else: false } }, position: 1, member_type: MEMBER.PLAYER, player_type: 1, avatar_url: 1, phone: 1 } } },
            { "$lookup": { "from": "foot_players", "localField": "player_detail.user_id", "foreignField": "send_to.user_id", "as": "footplayerDocument" } },
            { $project: { player_detail: 1, filteredfootplayerDocument: { $filter: { input: "$footplayerDocument", as: "element", cond: { $and: [{ $ne: ["$$element.sent_by", requestedData.user_id] }, { $eq: ["$$element.status", FOOTPLAYER_STATUS.ADDED] }, { $eq: ["$$element.is_deleted", false] }] } } } } },
            { $unwind: { path: "$filteredfootplayerDocument", preserveNullAndEmptyArrays: true } },
            { "$lookup": { "from": "club_academy_details", "localField": "filteredfootplayerDocument.sent_by", "foreignField": "user_id", "as": "SentBy" } },
            { $project: { player_detail: 1, club: { $filter: { input: "$SentBy", as: "element", cond: { $eq: ["$$element.member_type", MEMBER.CLUB] } } } } },
            { $unwind: { path: "$club", preserveNullAndEmptyArrays: true } },
            { $project: { player_detail: { user_id: 1, email: 1, first_name: 1, is_verified: 1, last_name: 1, position: 1, member_type: 1, player_type: 1, avatar_url: 1, phone: 1, club_name: "$club.name" } } },
            { $match: filterConditions }]);
            if (_.isEmpty(data)) {
                filterConditions = this._prepareClubAcademyFilterCondition(requestedData.filterConditions);
                data = await this.loginUtilityInst.aggregate([{ $match: { is_deleted: false, member_type: { $in: [MEMBER.CLUB, MEMBER.ACADEMY] } } },
                { $project: { user_id: 1, profile_status: 1, _id: 0 } }, { "$lookup": { "from": "club_academy_details", "localField": "user_id", "foreignField": "user_id", "as": "club_academy_detail" } }, { $unwind: { path: "$club_academy_detail" } },
                { $project: { club_academy_detail: { user_id: 1, name: 1, member_type: 1, is_verified: { $cond: { if: { $eq: ["$profile_status", PROFILE_STATUS.VERIFIED] }, then: true, else: false } }, type: 1, phone: 1, avatar_url: 1, email: 1 } } },
                { $match: filterConditions }]);
            }
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
    _preparePlayerFilterCondition(filterConditions = {}) {
        let condition = {};
        let filterArr = []
        if (filterConditions) {
            if (filterConditions.first_name) {
                filterArr.push({ "player_detail.first_name": new RegExp(filterConditions.first_name, 'i') })
            }
            if (filterConditions.last_name) {
                filterArr.push({ "player_detail.last_name": new RegExp(filterConditions.last_name, 'i') })
            }
            if (filterConditions.email) {
                filterArr.push({ "player_detail.email": filterConditions.email })
            }
            if (filterConditions.phone) {
                filterArr.push({ "player_detail.phone": filterConditions.phone })
            }
            condition = {
                $and: filterArr
            }
        }
        return filterArr.length ? condition : {}
    }

    /**
     * send footplayer request
     *
     * @param {*} [requestedData={}]
     * @returns
     * @memberof FootPlayerService
     */
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

    /**
     * validates requestedData for sendFootplayerRequest
     *
     * @param {*} [requestedData={}]
     * @returns
     * @memberof FootPlayerService
     */
    async sendFootplayerRequestValidator(requestedData = {}) {
        if (requestedData.send_to === requestedData.sent_by) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_SEND_FOOTPLAYER_REQUEST_TO_YOURSELF));
        }
        if (requestedData.send_to) {
            let to_be_footplayer = await this.loginUtilityInst.findOne({ user_id: requestedData.send_to, member_type: MEMBER.PLAYER }, { profile_status: 1 });
            if (_.isEmpty(to_be_footplayer)) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.MEMBER_TO_BE_FOOTPLAYER_NOT_FOUND));
            }
            if (to_be_footplayer && to_be_footplayer.profile_status && to_be_footplayer.profile_status != PROFILE_STATUS.VERIFIED) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.PLAYER_NOT_VERIFIED));
            }
        }
        let footplayerRequest = await this.footPlayerUtilityInst.findOne({ sent_by: requestedData.sent_by, "send_to.user_id": requestedData.send_to }, { status: 1, _id: 1 });
        if (!_.isEmpty(footplayerRequest)) {
            if (footplayerRequest.status === FOOTPLAYER_STATUS.PENDING) {
                return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.FOOTPLAYER_REQUEST_ALREADY_SENT));
            }
            if (footplayerRequest.status === FOOTPLAYER_STATUS.ADDED) {
                return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ALREADY_FOOTPLAYER));
            }
        }
        if (requestedData.member_type === MEMBER.CLUB) {
            await this.isFootplayerOfOtherClub(requestedData.send_to)
        }
        return Promise.resolve();
    }

    /**
     * checks if user is a footplayer of other club
     *
     * @param {*} user_id
     * @returns
     * @memberof FootPlayerService
     */
    async isFootplayerOfOtherClub(user_id) {
        try {
            let data = await this.footPlayerUtilityInst.aggregate([{ $match: { "send_to.user_id": user_id, status: FOOTPLAYER_STATUS.ADDED, is_deleted: false } },
            { "$lookup": { "from": "club_academy_details", "localField": "sent_by", "foreignField": "user_id", "as": "club_academy_detail" } },
            { $project: { club: { $filter: { input: "$club_academy_detail", as: "element", cond: { $eq: ["$$element.member_type", MEMBER.CLUB] } } } } },
            { $unwind: { path: "$club" } }, { $project: { _id: 0, footplayerOfClub: { $cond: { if: { $eq: ["$club", []] }, then: false, else: true } } } }
            ]);
            if (data && data.length > 0 && data[0] && data[0].footplayerOfClub) {
                return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ALREADY_FOOTPLAYER_OF_OTHER_CLUB));
            }
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in isFootplayerOfClub() of FootPlayerService", e);
            return Promise.reject(e);
        }
    }

    /**
     * prepare filter condition for club academy
     *
     * @param {*} [filterConditions={}]
     * @returns
     * @memberof FootPlayerService
     */
    _prepareClubAcademyFilterCondition(filterConditions = {}) {
        let condition = {};
        if (filterConditions) {
            if (filterConditions.email && !filterConditions.phone) {
                condition = { "club_academy_detail.email": filterConditions.email };
            }
            if (filterConditions.phone && !filterConditions.email) {
                condition = { "club_academy_detail.phone": filterConditions.phone }
            }
            if (filterConditions.phone && filterConditions.email) {
                condition = { $and: [{ "club_academy_detail.email": filterConditions.email }, { "club_academy_detail.phone": filterConditions.phone }] };
            }
        }
        return condition;
    }
}

module.exports = FootPlayerService;