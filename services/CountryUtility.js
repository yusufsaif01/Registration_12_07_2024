const CountrySchema = require("../schemas/CountrySchema");
const BaseUtility = require("./BaseUtility");

class CountryUtility extends BaseUtility {
  constructor() {
    super(CountrySchema);
  }
}

module.exports = CountryUtility;
