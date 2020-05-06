const ConnectionRequestSchema = require("../schemas/ConnectionRequestSchema");
const BaseUtility = require("./BaseUtility");

class ConnectionRequestUtility extends BaseUtility {
    constructor() {
        super(ConnectionRequestSchema);
    }
}

module.exports = ConnectionRequestUtility;