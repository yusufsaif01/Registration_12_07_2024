const BaseService = require("./BaseService");
const CountryUtility = require("../db/utilities/CountryUtility");

class CountryService extends BaseService {

    constructor() {
        super();
        this.countryUtilityInst = new CountryUtility();
    }
    async addCountry(countryName) {
        try {
            await this.countryUtilityInst.insert({ name: countryName })
        } catch (err) {
            return err;
        }
    }
}

module.exports = CountryService;