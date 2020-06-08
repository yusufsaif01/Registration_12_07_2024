const FootPlayerUtility = require('../db/utilities/FootPlayerUtility');
const LoginUtility = require('../db/utilities/LoginUtility');
const MEMBER = require('../constants/MemberType');
const PROFILE_STATUS = require('../constants/ProfileStatus');
const FOOTPLAYER_STATUS = require('../constants/FootPlayerStatus');
const FootPlayerSearchListResponseMapper = require("../dataModels/responseMapper/FootPlayerSearchListResponseMapper");
const _ = require("lodash");

class FootPlayerService {

    constructor() {
        this.footPlayerUtilityInst = new FootPlayerUtility();
        this.loginUtilityInst = new LoginUtility();
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
            { $project: { player_detail: { user_id: 1, email: 1, first_name: 1, last_name: 1, is_verified: { $cond: { if: { $eq: ["$profile_status.status", PROFILE_STATUS.VERIFIED] }, then: true, else: false } }, position: 1, member_type: MEMBER.PLAYER, player_type: 1, avatar_url: 1, phone: 1 } } },
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
                { $project: { club_academy_detail: { user_id: 1, name: 1, member_type: 1, is_verified: { $cond: { if: { $eq: ["$profile_status.status", PROFILE_STATUS.VERIFIED] }, then: true, else: false } }, type: 1, phone: 1, avatar_url: 1, email: 1 } } },
                { $match: filterConditions }]);
            }
            data = new FootPlayerSearchListResponseMapper().map(data);
            return { total: data.length, records: data };
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