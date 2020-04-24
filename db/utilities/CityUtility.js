const CitySchema = require("../schemas/CitySchema");
const BaseUtility = require("./BaseUtility");

class CityUtility extends BaseUtility {
    constructor() {
        super(CitySchema);
    }
}

module.exports = CityUtility;