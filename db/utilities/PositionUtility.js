const PositionSchema = require("../schemas/PositionSchema");
const BaseUtility = require("./BaseUtility");

class PositionUtility extends BaseUtility {
    constructor() {
        super(PositionSchema);
    }
}

module.exports = PositionUtility;