const ConnectionUtility = require('../db/utilities/ConnectionUtility');
const ConnectionRequestUtility = require('../db/utilities/ConnectionRequestUtility');
const errors = require("../errors");
const _ = require("lodash");
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const LoginUtility = require('../db/utilities/LoginUtility');
const MEMBER = require('../constants/MemberType');
const CONNECTION_REQUEST = require('../constants/ConnectionRequestStatus');
const FootmateRequestListResponseMapper = require("../dataModels/responseMapper/FootmateRequestListResponseMapper");
const MutualFootmateListResponseMapper = require("../dataModels/responseMapper/MutualFootmateListResponseMapper");
const FootmateListResponseMapper = require("../dataModels/responseMapper/FootmateListResponseMapper");

class ConnectionService {
    constructor() {
        this.connectionUtilityInst = new ConnectionUtility();
        this.connectionRequestUtilityInst = new ConnectionRequestUtility();
        this.loginUtilityInst = new LoginUtility();
    }

    async followMember(requestedData = {}, isUsedByAcceptRequestFunc) {
        try {
            if (!isUsedByAcceptRequestFunc)
                await this.followMemberValiation(requestedData);

            let connection_of_sent_by = await this.connectionUtilityInst.findOne({ user_id: requestedData.sent_by }, { followings: 1 });
            let connection_of_send_to = await this.connectionUtilityInst.findOne({ user_id: requestedData.send_to }, { followers: 1 });

            if (!connection_of_sent_by && !connection_of_send_to) {
                await this.createConnectionsAddFollwingsAddFollowers(requestedData.sent_by, requestedData.send_to);
            }
            else if (connection_of_sent_by && !connection_of_send_to) {
                await this.addFollowings(connection_of_sent_by, requestedData.sent_by, requestedData.send_to);
                await this.createConnectionAddFollowers(requestedData.sent_by, requestedData.send_to);
            }
            else if (!connection_of_sent_by && connection_of_send_to) {
                await this.createConnectionAddFollowings(requestedData.sent_by, requestedData.send_to);
                await this.addFollowers(requestedData.sent_by, requestedData.send_to, connection_of_send_to);
            }
            else {
                let following = await this.connectionUtilityInst.findOne({
                    user_id: requestedData.sent_by, followings: requestedData.send_to
                }, { followings: 1, _id: 0 });
                if (_.isEmpty(following)) {
                    await this.addFollowings(connection_of_sent_by, requestedData.sent_by, requestedData.send_to);
                    await this.addFollowers(requestedData.sent_by, requestedData.send_to, connection_of_send_to);
                }
                else if (!isUsedByAcceptRequestFunc) {
                    return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ALREADY_FOLLOWED));
                }
            }
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in followMember() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async followMemberValiation(requestedData = {}) {
        if (requestedData.send_to === requestedData.sent_by) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_FOLLOW_YOURSELF));
        }
        if (requestedData.send_to) {
            let to_be_followed_member = await this.loginUtilityInst.findOne({ user_id: requestedData.send_to });
            if (_.isEmpty(to_be_followed_member)) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.MEMBER_TO_BE_FOLLOWED_NOT_FOUND));
            }
        }
        return Promise.resolve();
    }

    async createConnectionsAddFollwingsAddFollowers(sent_by, send_to) {
        let records = [{ user_id: sent_by, followings: [send_to] }, { user_id: send_to, followers: [sent_by] }];
        await this.connectionUtilityInst.insertMany(records);
    }

    async createConnectionAddFollowings(sent_by, send_to) {
        let record = { user_id: sent_by, followings: [send_to] };
        await this.connectionUtilityInst.insert(record);
    }

    async createConnectionAddFollowers(sent_by, send_to) {
        let record = { user_id: send_to, followers: [sent_by] };
        await this.connectionUtilityInst.insert(record);
    }

    async addFollowers(sent_by, send_to, connection_of_send_to) {
        let followers_of_send_to = connection_of_send_to.followers || [];
        followers_of_send_to.push(sent_by);
        await this.connectionUtilityInst.updateOne({ user_id: send_to }, { followers: followers_of_send_to });
    }

    async addFollowings(connection_of_sent_by, sent_by, send_to) {
        let followings_of_sent_by = connection_of_sent_by.followings || [];
        followings_of_sent_by.push(send_to);
        await this.connectionUtilityInst.updateOne({ user_id: sent_by }, { followings: followings_of_sent_by });
    }

    async unfollowMember(requestedData = {}) {
        try {
            let data = await this.unfollowMemberValiation(requestedData);
            let followers = data.followers, followings = data.followings;
            _.remove(followings, function (member) {
                return member === requestedData.send_to;
            })
            await this.connectionUtilityInst.updateOne({ user_id: requestedData.sent_by }, { followings: followings });

            _.remove(followers, function (member) {
                return member === requestedData.sent_by;
            })
            await this.connectionUtilityInst.updateOne({ user_id: requestedData.send_to }, { followers: followers });
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in unfollowMember() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async unfollowMemberValiation(requestedData = {}) {
        if (requestedData.send_to === requestedData.sent_by) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_UNFOLLOW_YOURSELF));
        }
        if (requestedData.send_to) {
            let to_be_followed_member = await this.loginUtilityInst.findOne({ user_id: requestedData.send_to });
            if (_.isEmpty(to_be_followed_member)) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.MEMBER_TO_BE_UNFOLLOWED_NOT_FOUND));
            }
        }
        let condition = { $or: [{ user_id: requestedData.sent_by, followings: requestedData.send_to }, { user_id: requestedData.send_to, followers: requestedData.sent_by }] }
        let connections = await this.connectionUtilityInst.find(condition, { followings: 1, followers: 1, user_id: 1, _id: 0 });
        let connection_of_sent_by = _.find(connections, { user_id: requestedData.sent_by });
        let connection_of_send_to = _.find(connections, { user_id: requestedData.send_to });
        if (_.isEmpty(connection_of_sent_by) || _.isEmpty(connection_of_send_to)) {
            return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ALREADY_UNFOLLOWED));
        }

        return Promise.resolve({ followings: connection_of_sent_by.followings, followers: connection_of_send_to.followers });
    }

    async sendFootMateRequest(requestedData = {}) {
        try {
            await this.sendFootMateRequestValidator(requestedData);
            await this.connectionRequestUtilityInst.insert({ sent_by: requestedData.sent_by, send_to: requestedData.send_to });
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in sendFootMateRequest() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async sendFootMateRequestValidator(requestedData = {}) {
        if (requestedData.member_type !== MEMBER.PLAYER) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.ONLY_PLAYER_CAN_SEND_FOOTMATE_REQUEST));
        }
        if (requestedData.send_to === requestedData.sent_by) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_SEND_FOOTMATE_REQUEST_TO_YOURSELF));
        }
        if (requestedData.send_to) {
            let to_be_footMate = await this.loginUtilityInst.findOne({ user_id: requestedData.send_to, member_type: MEMBER.PLAYER });
            if (_.isEmpty(to_be_footMate)) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.MEMBER_TO_BE_FOOTMATE_NOT_FOUND));
            }
        }
        let footMateRequest = await this.connectionRequestUtilityInst.findOne({ sent_by: requestedData.sent_by, send_to: requestedData.send_to });
        if (!_.isEmpty(footMateRequest)) {
            return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.FOOTMATE_REQUEST_ALREADY_SENT));
        }
        let connection = await this.connectionUtilityInst.findOne({
            user_id: requestedData.sent_by, footmates: requestedData.send_to
        }, { footmates: 1, _id: 0 });
        if (!_.isEmpty(connection)) {
            return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ALREADY_FOOTMATE));
        }
        return Promise.resolve();
    }

    async acceptFootMateRequest(requestedData = {}) {
        try {
            let sent_by = await this.footMateRequestValidator(requestedData);
            let updatedDoc = { status: CONNECTION_REQUEST.ACCEPTED, is_deleted: true, deleted_at: Date.now() };
            let condition = { $or: [{ sent_by: requestedData.user_id, send_to: sent_by }, { sent_by: sent_by, send_to: requestedData.user_id }] };

            await this.connectionRequestUtilityInst.updateMany(condition, updatedDoc);
            await this.followMember({ sent_by: sent_by, send_to: requestedData.user_id }, true);
            await this.followMember({ sent_by: requestedData.user_id, send_to: sent_by }, true);
            await this.makeFootmates({ sent_by: sent_by, send_to: requestedData.user_id });
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in acceptFootMateRequest() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async makeFootmates(requestedData = {}) {
        let condition = { $or: [{ user_id: requestedData.sent_by }, { user_id: requestedData.send_to }] };
        let connections = await this.connectionUtilityInst.find(condition, { user_id: 1, footmates: 1 });
        let connection_of_sent_by = _.find(connections, { user_id: requestedData.sent_by });
        let connection_of_send_to = _.find(connections, { user_id: requestedData.send_to });

        let footmates_of_sent_by = connection_of_sent_by.footmates || [];
        footmates_of_sent_by.push(requestedData.send_to);
        let footmates_of_send_to = connection_of_send_to.footmates || [];
        footmates_of_send_to.push(requestedData.sent_by);
        await this.connectionUtilityInst.updateOne({ user_id: requestedData.sent_by }, { footmates: footmates_of_sent_by });
        await this.connectionUtilityInst.updateOne({ user_id: requestedData.send_to }, { footmates: footmates_of_send_to });
    }

    async footMateRequestValidator(requestedData = {}) {
        let footMateRequest = await this.connectionRequestUtilityInst.findOne({ status: CONNECTION_REQUEST.PENDING, request_id: requestedData.request_id, send_to: requestedData.user_id });
        if (_.isEmpty(footMateRequest)) {
            return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.FOOTMATE_REQUEST_NOT_FOUND));
        }
        return Promise.resolve(footMateRequest.sent_by);
    }

    async rejectFootMateRequest(requestedData = {}) {
        try {
            let sent_by = await this.footMateRequestValidator(requestedData);
            let updatedDoc = { status: CONNECTION_REQUEST.REJECTED, is_deleted: true, deleted_at: Date.now() };
            let condition = { $or: [{ sent_by: requestedData.user_id, send_to: sent_by }, { sent_by: sent_by, send_to: requestedData.user_id }] };
            await this.connectionRequestUtilityInst.updateMany(condition, updatedDoc);
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in rejectFootMateRequest() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async cancelFootMate(requestedData = {}) {
        try {
            let data = await this.cancelFootMateValiation(requestedData);
            let connection_of_sent_by = data.connection_of_sent_by, connection_of_send_to = data.connection_of_send_to;
            _.remove(connection_of_sent_by.footmates, function (member) {
                return member === requestedData.send_to;
            })
            _.remove(connection_of_sent_by.followers, function (member) {
                return member === requestedData.send_to;
            })
            _.remove(connection_of_sent_by.followings, function (member) {
                return member === requestedData.send_to;
            })
            await this.connectionUtilityInst.updateOne({ user_id: requestedData.sent_by }, connection_of_sent_by);
            _.remove(connection_of_send_to.footmates, function (member) {
                return member === requestedData.sent_by;
            })
            _.remove(connection_of_send_to.followers, function (member) {
                return member === requestedData.sent_by;
            })
            _.remove(connection_of_send_to.followings, function (member) {
                return member === requestedData.sent_by;
            })
            await this.connectionUtilityInst.updateOne({ user_id: requestedData.send_to }, connection_of_send_to);
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in cancelFootMate() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async cancelFootMateValiation(requestedData = {}) {
        if (requestedData.send_to === requestedData.sent_by) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_SEND_CANCEL_FOOTMATE_TO_YOURSELF));
        }
        if (requestedData.send_to) {
            let to_be_cancelled_footmate = await this.loginUtilityInst.findOne({ user_id: requestedData.send_to });
            if (_.isEmpty(to_be_cancelled_footmate)) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.FOOTMATE_TO_BE_CANCELLED_NOT_FOUND));
            }
        }
        let condition = { $or: [{ user_id: requestedData.sent_by, footmates: requestedData.send_to }, { user_id: requestedData.send_to, footmates: requestedData.sent_by }] };
        let connections = await this.connectionUtilityInst.find(condition, { footmates: 1, followings: 1, followers: 1, user_id: 1, _id: 0 });
        let connection_of_sent_by = _.find(connections, { user_id: requestedData.sent_by });
        let connection_of_send_to = _.find(connections, { user_id: requestedData.send_to });
        if (_.isEmpty(connection_of_sent_by) || _.isEmpty(connection_of_send_to)) {
            return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ALREADY_CANCELLED_FOOTMATE));
        }

        return Promise.resolve({ connection_of_sent_by: connection_of_sent_by, connection_of_send_to: connection_of_send_to });
    }

    async getFootMateRequestList(requestedData = {}) {
        try {
            let paginationOptions = requestedData.paginationOptions || {};
            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount };
            let data = await this.connectionRequestUtilityInst.aggregate([{ $match: { send_to: requestedData.user_id, status: CONNECTION_REQUEST.PENDING } },
            { $skip: options.skip }, { $limit: options.limit },
            { "$lookup": { "from": "connections", "localField": "sent_by", "foreignField": "user_id", "as": "connection_sent_by" } },
            { $unwind: { path: "$connection_sent_by", preserveNullAndEmptyArrays: true } },
            { "$lookup": { "from": "connections", "localField": "send_to", "foreignField": "user_id", "as": "connection_send_to" } },
            { $unwind: { path: "$connection_send_to", preserveNullAndEmptyArrays: true } },
            { $project: { request_id: 1, _id: 0, sent_by: 1, send_to: 1, mutual: { $setIntersection: ["$connection_sent_by.footmates", "$connection_send_to.footmates"] } } },
            { "$lookup": { "from": "player_details", "localField": "sent_by", "foreignField": "user_id", "as": "player_details" } },
            { $unwind: { path: "$player_details", preserveNullAndEmptyArrays: true } },
            { $project: { request_id: 1, player_details: { first_name: 1, last_name: 1, user_id: 1, position: 1, player_type: 1, avatar_url: 1 }, mutual: 1 } }
            ]);
            data = new FootmateRequestListResponseMapper().map(data);
            let totalRecords = await this.connectionRequestUtilityInst.countList({ send_to: requestedData.user_id, status: CONNECTION_REQUEST.PENDING });
            let response = { total: totalRecords, records: data }
            return Promise.resolve(response);
        }
        catch (e) {
            console.log("Error in getFootMateRequestList() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async getMutualFootMateList(requestedData = {}) {
        try {
            await this.getMutualFootMateListValidator(requestedData);
            let data = await this.connectionUtilityInst.aggregate([{ $match: { user_id: requestedData.user_id } },
            { $project: { _id: 0, footmates_of_current_user: "$footmates", user_id_mutual_with: requestedData.mutual_with } },
            { "$lookup": { "from": "connections", "localField": "user_id_mutual_with", "foreignField": "user_id", "as": "connection_of_mutual_with" } },
            { $unwind: { path: "$connection_of_mutual_with" } },
            { $project: { _id: 0, mutual: { $setIntersection: ["$footmates_of_current_user", "$connection_of_mutual_with.footmates"] } } },
            { $unwind: { path: "$mutual" } },
            { "$lookup": { "from": "player_details", "localField": "mutual", "foreignField": "user_id", "as": "player_details" } },
            { $unwind: { path: "$player_details", preserveNullAndEmptyArrays: true } },
            { $project: { player_details: { first_name: 1, last_name: 1, position: 1, player_type: 1, avatar_url: 1, user_id: 1 } } }
            ]);
            data = new MutualFootmateListResponseMapper().map(data);
            return Promise.resolve({ total: data.length, records: data });
        }
        catch (e) {
            console.log("Error in getMutualFootMateList() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async getMutualFootMateListValidator(requestedData = {}) {
        let mutual_with_login_detail = await this.loginUtilityInst.findOne({ user_id: requestedData.mutual_with, member_type: MEMBER.PLAYER });
        if (_.isEmpty(mutual_with_login_detail)) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.MUTUAL_WITH_USER_NOT_FOUND));
        }
    }

    async getFootMateList(requestedData = {}) {
        try {
            let paginationOptions = requestedData.paginationOptions || {};
            let filterConditions = this._prepareFootMateFilterCondition(requestedData.filters);
            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount };
            let data = await this.connectionUtilityInst.aggregate([{ $match: { user_id: requestedData.user_id } },
            { $project: { footmates: 1, current_user_footmates: "$footmates", _id: 0 } }, { $unwind: { path: "$footmates" } },
            { "$lookup": { "from": "connections", "localField": "footmates", "foreignField": "user_id", "as": "connection_of_current_user_footmate" } },
            { $unwind: { path: "$connection_of_current_user_footmate" } },
            { $project: { connection_of_current_user_footmate: { footmates: 1, user_id: 1 }, current_user_footmates: 1 } },
            { $project: { user_id_footmate: "$connection_of_current_user_footmate.user_id", mutual: { $size: { $setIntersection: ["$current_user_footmates", "$connection_of_current_user_footmate.footmates"] } } } },
            { $unwind: { path: "$mutual" } },
            { "$lookup": { "from": "player_details", "localField": "user_id_footmate", "foreignField": "user_id", "as": "player_details" } },
            { $unwind: { path: "$player_details", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    player_details: { first_name: 1, last_name: 1, user_id: 1, strong_foot: 1, country: 1, state: 1, city: 1, position: 1, player_type: 1, avatar_url: 1, dob: 1 }, mutual: 1,
                    age: {
                        $subtract: [{ $subtract: [{ $year: "$$NOW" }, { $year: "$player_details.dob" }] },
                        { $cond: [{ $gt: [0, { $subtract: [{ $dayOfYear: "$$NOW" }, { $dayOfYear: "$player_details.dob" }] }] }, 1, 0] }]
                    }
                }
            },
            { $match: filterConditions }, { $project: { player_details: { first_name: 1, last_name: 1, user_id: 1, position: 1, player_type: 1, avatar_url: 1 }, mutual: 1, } },
            { $skip: options.skip }, { $limit: options.limit }]);
            data = new FootmateListResponseMapper().map(data);

            let connection_of_user = await this.connectionUtilityInst.findOne({ user_id: requestedData.user_id }, { footmates: 1, _id: 0 });
            let totalRecords = 0;
            if (connection_of_user && connection_of_user.footmates && connection_of_user.footmates.length) {
                totalRecords = connection_of_user.footmates.length;
            }
            let response = { total: totalRecords, records: data }
            return Promise.resolve(response);
        }
        catch (e) {
            console.log("Error in getFootMateList() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    _prepareFootMateFilterCondition(filterConditions = {}) {
        let condition = {};
        let filterArr = []
        if (filterConditions) {
            if (filterConditions.age) {
                let Age = [];
                filterConditions.age.forEach(val => {
                    let [lowerEndAge, higherEndAge] = val.split("-")
                    Age.push({
                        age: {
                            $gte: Number(lowerEndAge),
                            $lte: Number(higherEndAge)
                        }
                    });
                });
                filterArr.push({ $or: Age })
            }
            if (filterConditions.country) {
                filterArr.push({
                    "player_details.country": new RegExp(filterConditions.country, 'i')
                });
            }
            if (filterConditions.state) {
                filterArr.push({
                    "player_details.state": new RegExp(filterConditions.state, 'i')
                });
            }
            if (filterConditions.city) {
                filterArr.push({
                    "player_details.city": new RegExp(filterConditions.city, 'i')
                });
            }
            if (filterConditions.strong_foot) {
                let strong_foot = [];
                filterConditions.strong_foot.forEach(val => {
                    strong_foot.push({ "player_details.strong_foot": new RegExp(val, 'i') })
                });
                filterArr.push({ $or: strong_foot })
            }
            if (filterConditions.position && filterConditions.position.length) {
                let position = [];
                filterConditions.position.forEach(val => {
                    position.push({
                        "player_details.position": {
                            $elemMatch: {
                                name: new RegExp(val, 'i'),
                            }
                        }
                    })
                });
                filterArr.push({ $or: position })
            }
            if (filterConditions.player_type && filterConditions.player_type.length) {
                let player_type = [];
                filterConditions.player_type.forEach(val => {
                    player_type.push({ "player_details.player_type": new RegExp(val, 'i') })
                });
                filterArr.push({ $or: player_type })
            }
            condition = {
                $and: filterArr
            }
        }
        return filterArr.length ? condition : {}
    }
}
module.exports = ConnectionService;