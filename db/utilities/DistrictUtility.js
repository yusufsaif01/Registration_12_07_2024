const DistrictSchema = require("../schemas/DistrictSchema");
const BaseUtility = require("./BaseUtility");

class DistrictUtility extends BaseUtility {
    constructor() {
        super(DistrictSchema);
    }
}

module.exports = DistrictUtility;