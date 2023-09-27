const LikeSchema = require("../schemas/LikeSchema");
const BaseUtility = require("./BaseUtility");

class LikeUtility extends BaseUtility {
    constructor() {
        super(LikeSchema);
    }
}

module.exports = LikeUtility;