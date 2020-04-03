const City = require("csc-client").City;
const Country = require("csc-client").Country;
const State = require("csc-client").State;

class MasterDataService {
    constructor() {
        this.city = new City();
        this.country = new Country();
        this.state = new State();
    }

    getAllCountries() {
        return this.country.getAllCountries();
    }
    getCountryById(id) {
        return this.country.getCountryById(id);
    }
    getCountryByCountryCode(code) {
        return this.country.getCountriesByCountryCode(code);
    }

    getAllStates() {
        return this.state.getAllStates();
    }
    getStateById(id) {
        return this.state.getStateById(id);
    }
    getStatesByCountryId(countryId) {
        return this.state.getStatesByCountryId(countryId);
    }

    getAllCities() {
        return this.city.getAllCities();
    }
    getCityById(id) {
        return this.city.getCityById(id);
    }
    getCitiesByStateId(stateId) {
        return this.city.getCitiesByStateId(stateId);
    }
}

module.exports = MasterDataService;