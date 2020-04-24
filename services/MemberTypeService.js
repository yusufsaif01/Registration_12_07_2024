const MemberTypeUtility = require('../db/utilities/MemberTypeUtility');

class MemberTypeService {

	constructor(){
        this.memberTypeUtilityInst = new MemberTypeUtility();
    }
    async addMemberTypes(data = []) {
        try {
            await this.memberTypeUtilityInst.insertMany(data)
        } catch (err) {
            return err;
        }
    }

}

module.exports = MemberTypeService;