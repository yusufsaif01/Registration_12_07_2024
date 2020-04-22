const City = require("csc-client").City;
const Country = require("csc-client").Country;
const State = require("csc-client").State;
const CountryUtility = require('../db/utilities/CountryUtility');
const errors = require("../errors");
const StateUtility = require('../db/utilities/StateUtility');
const _ = require("lodash");
const LocationListResponseMapper = require("../dataModels/responseMapper/LocationListResponseMapper");

class LocationService {
    constructor() {
        this.city = new City();
        this.country = new Country();
        this.state = new State();
        this.countryUtilityInst = new CountryUtility();
        this.stateUtilityInst = new StateUtility();
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
    async getLocationStats() {
        try {
            let data = await this.countryUtilityInst.aggregate([
                { $lookup: { from: "states", localField: "id", foreignField: "country_id", as: "output" } },
                { $project: { total_states: { $size: "$output" }, name: 1, output: 1 } },
                { $unwind: { path: "$output", preserveNullAndEmptyArrays: true } },
                { $lookup: { from: "cities", localField: "output.id", foreignField: "state_id", as: "city list" } },
                { $project: { total_states: 1, name: 1, total_cities: { $size: "$city list" } } },
                {
                    $group: {
                        _id: { country: "$name", total_states: "$total_states" },
                        total_cities: { $sum: "$total_cities" }
                    }
                }])
            data = new LocationListResponseMapper().map(data);
            return Promise.resolve(data)
        } catch (err) {
            return err;
        }
    }
    async addCountry(data = {}) {
        try {
            await this.countryUtilityInst.insert({
                name: data.name,
                phone_code: data.phone_code, sortname: data.sortname
            })
        } catch (err) {
            return err;
        }
    }
    async addState(data = {}) {
        try {
            let { id } = await this.countryUtilityInst.findOne({ name: "India" }, { id: 1 })
            data.name = data.name.trim().replace(/\s\s+/g, ' ');
            if (_.isEmpty(data.name)) {
                return Promise.reject(new errors.ValidationFailed("name cannot be empty"));
            }
            let regex = new RegExp(["^", data.name, "$"].join(""), "i");
            const state = await this.stateUtilityInst.findOne({ name: regex, country_id: id });
            if (!_.isEmpty(state)) {
                return Promise.reject(new errors.Conflict("State already added"));
            }
            await this.stateUtilityInst.insert({ name: data.name, country_id: id })
            Promise.resolve()
        } catch (e) {
            console.log("Error in addState() of LocationService", e);
            return Promise.reject(e);
        }
    }
}

module.exports = LocationService;