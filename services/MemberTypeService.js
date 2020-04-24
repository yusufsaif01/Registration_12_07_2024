const MemberTypeUtility = require('../db/utilities/MemberTypeUtility');
const MemberTypeListResponseMapper = require("../dataModels/responseMapper/MemberTypeListResponseMapper");

class MemberTypeService {

    constructor() {
        this.memberTypeUtilityInst = new MemberTypeUtility();
    }
    async addMemberTypes(data = []) {
        try {
            await this.memberTypeUtilityInst.insertMany(data)
        } catch (err) {
            return err;
        }
    }
    async getMemberTypeList() {
        try {
            let projection = { id: 1, category: 1, sub_category: 1 }
            let data = await this.memberTypeUtilityInst.find({}, projection, null);
            data = new MemberTypeListResponseMapper().map(data);
            return data;
        } catch (e) {
            console.log("Error in getList() of MemberTypeService", e);
            return Promise.reject(e);
        }
    }
}

module.exports = MemberTypeService;