const StateSchema = require("../schemas/StateSchema");
const BaseUtility = require("./BaseUtility");

class StateUtility extends BaseUtility {
    constructor() {
        super(StateSchema);
    }
}

module.exports = StateUtility;