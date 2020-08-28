const AccessWhitelistSchema = require("../schemas/AccessWhitelist");
const BaseUtility = require("./BaseUtility");

class AccessWhitelistUtility extends BaseUtility {
  constructor() {
    super(AccessWhitelistSchema);
  }
}

module.exports = AccessWhitelistUtility;
