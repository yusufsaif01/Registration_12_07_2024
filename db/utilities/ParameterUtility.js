const ParameterSchema = require("../schemas/ParameterSchema");
const BaseUtility = require("./BaseUtility");

class ParameterUtility extends BaseUtility {
    constructor() {
        super(ParameterSchema);
    }
}

module.exports = ParameterUtility;