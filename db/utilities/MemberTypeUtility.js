const MemberTypeSchema = require("../schemas/MemberTypeSchema");
const BaseUtility = require("./BaseUtility");

class MemberTypeUtility extends BaseUtility {
    constructor() {
        super(MemberTypeSchema);
    }
}

module.exports = MemberTypeUtility;