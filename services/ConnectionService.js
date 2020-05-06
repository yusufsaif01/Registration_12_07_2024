const ConnectionUtility = require('../db/utilities/ConnectionUtility');
const ConnectionRequestUtility = require('../db/utilities/ConnectionRequestUtility');
const _ = require("lodash");

class ConnectionService {
    constructor() {
        this.connectionUtilityInst = new ConnectionUtility();
        this.connectionRequestUtilityInst = new ConnectionRequestUtility();
    }

    async followMember(requestedData = {}) {
        try {
            let connection_of_sent_by = await this.connectionUtilityInst.findOne({ user_id: requestedData.sent_by });
            let connection_of_send_to = await this.connectionUtilityInst.findOne({ user_id: requestedData.send_to });

            if (!connection_of_sent_by && !connection_of_send_to) {
                await this.createConnectionAddFollowings(requestedData.sent_by, requestedData.send_to);
                await this.createConnectionAddFollowers(requestedData.sent_by, requestedData.send_to);
            }
            else if (connection_of_sent_by && !connection_of_send_to) {
                await this.addFollowings(connection_of_sent_by, requestedData.send_to);
                await this.createConnectionAddFollowers(requestedData.sent_by, requestedData.send_to);
            }
            else if (!connection_of_sent_by && connection_of_send_to) {
                await this.createConnectionAddFollowings(requestedData.sent_by, requestedData.send_to);
                await this.addFollowers(requestedData.sent_by, connection_of_send_to);
            }
            else {
                await this.addFollowings(connection_of_sent_by, requestedData.send_to);
                await this.addFollowers(requestedData.sent_by, connection_of_send_to);
            }
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in followMember() of ConnectionService", e);
            return Promise.reject(e);
        }
    }

    async createConnectionAddFollowings(sent_by, send_to) {
        let record = { user_id: sent_by, followings: [send_to] };
        await this.connectionUtilityInst.insert(record);
    }

    async createConnectionAddFollowers(sent_by, send_to) {
        let record = { user_id: send_to, followers: [sent_by] };
        await this.connectionUtilityInst.insert(record);
    }

    async addFollowers(sent_by, connection_of_send_to) {
        let followers_of_send_to = connection_of_send_to.followers || [];
        followers_of_send_to.push(sent_by);
        await this.connectionUtilityInst.updateOne({ user_id: connection_of_send_to.user_id }, { followers: followers_of_send_to });
    }

    async addFollowings(connection_of_sent_by, send_to) {
        let followings_of_sent_by = connection_of_sent_by.followings || [];
        followings_of_sent_by.push(send_to);
        await this.connectionUtilityInst.updateOne({ user_id: connection_of_sent_by.user_id }, { followings: followings_of_sent_by });
    }
}
module.exports = ConnectionService;