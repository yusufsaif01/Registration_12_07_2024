const CountryUtility = require('../db/utilities/CountryUtility');
const _ = require("lodash");
const LocationListResponseMapper = require("../dataModels/responseMapper/LocationListResponseMapper");

class LocationService {
    constructor() {
        this.countryUtilityInst = new CountryUtility();
    }

    async getLocationStats() {
        try {
            let data = await this.countryUtilityInst.aggregate([
                { $lookup: { from: "states", localField: "id", foreignField: "country_id", as: "output" } },
                { $project: { total_states: { $size: "$output" }, id: 1, name: 1, output: 1 } },
                { $unwind: { path: "$output", preserveNullAndEmptyArrays: true } },
                { $lookup: { from: "cities", localField: "output.id", foreignField: "state_id", as: "city list" } },
                { $project: { id: 1, total_states: 1, name: 1, total_cities: { $size: "$city list" } } },
                {
                    $group: {
                        _id: { country: "$name", country_id: "$id", total_states: "$total_states" },
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
}

module.exports = LocationService;