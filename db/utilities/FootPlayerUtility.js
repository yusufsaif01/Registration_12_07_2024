const FootPlayerSchema = require("../schemas/FootPlayerSchema");
const BaseUtility = require("./BaseUtility");

class FootPlayerUtility extends BaseUtility {
    constructor() {
        super(FootPlayerSchema);
    }
}

module.exports = FootPlayerUtility;