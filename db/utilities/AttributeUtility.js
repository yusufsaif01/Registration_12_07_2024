const AttributeSchema = require("../schemas/AttributeSchema");
const BaseUtility = require("./BaseUtility");

class AttributeUtility extends BaseUtility {
    constructor() {
        super(AttributeSchema);
    }
}

module.exports = AttributeUtility;