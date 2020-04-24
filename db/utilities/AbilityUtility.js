const AbilitySchema = require("../schemas/AbilitySchema");
const BaseUtility = require("./BaseUtility");

class AbilityUtility extends BaseUtility {
    constructor() {
        super(AbilitySchema);
    }
}

module.exports = AbilityUtility;