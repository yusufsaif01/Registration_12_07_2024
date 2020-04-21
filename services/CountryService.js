const BaseService = require("./BaseService");
const CountryUtility = require("../db/utilities/CountryUtility");

class CountryService extends BaseService {

    constructor() {
        super();
        this.countryUtilityInst = new CountryUtility();
    }
    addIndia() {
        try {
            await this.countryUtilityInst.insert({ name: "India" })
        } catch (err) {
            return err;
        }
    }
}

module.exports = CountryService;