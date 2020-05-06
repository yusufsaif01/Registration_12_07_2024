const ConnectionSchema = require("../schemas/ConnectionSchema");
const BaseUtility = require("./BaseUtility");

class ConnectionUtility extends BaseUtility {
    constructor() {
        super(ConnectionSchema);
    }
}

module.exports = ConnectionUtility;