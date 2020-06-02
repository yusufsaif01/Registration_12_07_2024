const FootPlayerUtility = require('../db/utilities/FootPlayerUtility');
const LoginUtility = require('../db/utilities/LoginUtility');
const MEMBER = require('../constants/MemberType');
const PROFILE_STATUS = require('../constants/ProfileStatus');
const FOOTPLAYER_STATUS = require('../constants/FootPlayerStatus');
const FootPlayerSearchListResponseMapper = require("../dataModels/responseMapper/FootPlayerSearchListResponseMapper");

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
    async getPlayersList(requestedData = {}) {
        try {
            let filterConditions = this._prepareFilterCondition(requestedData.filterConditions)
            let data = await this.loginUtilityInst.aggregate([{ $match: { profile_status: PROFILE_STATUS.VERIFIED, is_deleted: false, member_type: MEMBER.PLAYER } },
            { $project: { user_id: 1, _id: 0 } }, { "$lookup": { "from": "player_details", "localField": "user_id", "foreignField": "user_id", "as": "player_detail" } }, { $unwind: { path: "$player_detail" } },
            { $project: { user_id: "$player_detail.user_id", email: "$player_detail.email", first_name: "$player_detail.first_name", last_name: "$player_detail.last_name", position: "$player_detail.position", player_type: "$player_detail.player_type", avatar_url: "$player_detail.avatar_url", phone: "$player_detail.phone" } },
            { "$lookup": { "from": "foot_players", "localField": "user_id", "foreignField": "send_to.user_id", "as": "footplayerDocument" } },
            { $project: { user_id: 1, first_name: 1, last_name: 1, position: 1, player_type: 1, phone: 1, email: 1, avatar_url: 1, filteredfootplayerDocument: { $filter: { input: "$footplayerDocument", as: "element", cond: { $and: [{ $ne: ["$$element.sent_by", requestedData.user_id] },{ $eq: ["$$element.status", FOOTPLAYER_STATUS.ADDED] }, { $eq: ["$$element.is_deleted", false] }] } } } } },
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
}

module.exports = FootPlayerService;