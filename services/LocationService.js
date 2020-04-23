const CountryUtility = require('../db/utilities/CountryUtility');
const errors = require("../errors");
const StateUtility = require('../db/utilities/StateUtility');
const CityUtility = require('../db/utilities/CityUtility');
const _ = require("lodash");
const LocationListResponseMapper = require("../dataModels/responseMapper/LocationListResponseMapper");
const StateListResponseMapper = require("../dataModels/responseMapper/StateListResponseMapper");

class LocationService {
    constructor() {
        this.countryUtilityInst = new CountryUtility();
        this.stateUtilityInst = new StateUtility();
        this.cityUtilityInst = new CityUtility();
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
    async addState(data = {}) {
        try {
            let country = await this.countryUtilityInst.findOne({ id: data.country_id })
            if (_.isEmpty(country)) {
                return Promise.reject(new errors.NotFound("Country not found"));
            }
            let reqObj = data.reqObj;
            reqObj.name = reqObj.name.trim().replace(/\s\s+/g, ' ');
            if (_.isEmpty(reqObj.name)) {
                return Promise.reject(new errors.ValidationFailed("name cannot be empty"));
            }
            let regex = new RegExp(["^", reqObj.name, "$"].join(""), "i");
            const state = await this.stateUtilityInst.findOne({ name: regex, country_id: data.country_id });
            if (!_.isEmpty(state)) {
                return Promise.reject(new errors.Conflict("State already added"));
            }
            await this.stateUtilityInst.insert({ name: reqObj.name, country_id: data.country_id })
            Promise.resolve()
        } catch (e) {
            console.log("Error in addState() of LocationService", e);
            return Promise.reject(e);
        }
    }
    async getStateList(country_id) {
        try {
            let response = {}, totalRecords = 0;
            let country = await this.countryUtilityInst.findOne({ id: country_id })
            if (_.isEmpty(country)) {
                return Promise.reject(new errors.NotFound("Country not found"));
            }
            totalRecords = await this.stateUtilityInst.countList({ country_id: country_id });
            let projection = { name: 1, id: 1 }
            let data = await this.stateUtilityInst.find({ country_id: country_id }, projection);
            data = new StateListResponseMapper().map(data);
            response = {
                total: totalRecords,
                records: data
            }
            return response;
        } catch (e) {
            console.log("Error in getStateList() of LocationService", e);
            return Promise.reject(e);
        }
    }
    async editState(data = {}) {
        try {
            let country = await this.countryUtilityInst.findOne({ id: data.country_id });
            if (_.isEmpty(country)) {
                return Promise.reject(new errors.NotFound("Country not found"));
            }
            const foundState = await this.stateUtilityInst.findOne({
                id: data.state_id,
                country_id: data.country_id
            })
            if (_.isEmpty(foundState)) {
                return Promise.reject(new errors.NotFound("State not found"));
            }
            let reqObj = data.reqObj;
            reqObj.name = reqObj.name.trim().replace(/\s\s+/g, ' ');
            if (_.isEmpty(reqObj.name)) {
                return Promise.reject(new errors.ValidationFailed("name cannot be empty"));
            }
            let regex = new RegExp(["^", reqObj.name, "$"].join(""), "i");
            const state = await this.stateUtilityInst.findOne({
                name: regex,
                country_id: data.country_id, id: data.state_id
            });
            if (!_.isEmpty(state)) {
                return Promise.reject(new errors.Conflict("State already added"));
            }
            await this.stateUtilityInst.updateOne({ id: data.state_id }, { name: reqObj.name })
            Promise.resolve()
        } catch (e) {
            console.log("Error in editState() of LocationService", e);
            return Promise.reject(e);
        }
    }
    async addCity(data = {}) {
        try {
            let country = await this.countryUtilityInst.findOne({ id: data.country_id });
            if (_.isEmpty(country)) {
                return Promise.reject(new errors.NotFound("Country not found"));
            }
            let foundState = await this.stateUtilityInst.findOne({
                id: data.state_id,
                country_id: data.country_id
            })
            if (_.isEmpty(foundState)) {
                return Promise.reject(new errors.NotFound("State not found"));
            }
            let reqObj = data.reqObj;
            reqObj.name = reqObj.name.trim().replace(/\s\s+/g, ' ');
            if (_.isEmpty(reqObj.name)) {
                return Promise.reject(new errors.ValidationFailed("name cannot be empty"));
            }
            let regex = new RegExp(["^", reqObj.name, "$"].join(""), "i");
            const city = await this.cityUtilityInst.findOne({ name: regex, state_id: data.state_id });
            if (!_.isEmpty(city)) {
                return Promise.reject(new errors.Conflict("City already added"));
            }
            await this.cityUtilityInst.insert({ name: reqObj.name, state_id: data.state_id })
            Promise.resolve()
        } catch (e) {
            console.log("Error in addCity() of LocationService", e);
            return Promise.reject(e);
        }
    }
    async getCityList(requestedData = {}) {
        try {
            let conditions = this._prepareSearchCondition(requestedData.filter);

            let paginationOptions = requestedData.paginationOptions || {};
            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount };

            let response = {}, totalRecords = 0;
            let { id } = await this.countryUtilityInst.findOne({ name: "India" }, { id: 1 })
            let foundState = await this.stateUtilityInst.findOne({ id: requestedData.state_id, country_id: id })
            if (_.isEmpty(foundState)) {
                return Promise.reject(new errors.NotFound("State not found"));
            }
            totalRecords = await this.stateUtilityInst.countList({ country_id: id });
            let projection = { name: 1, id: 1 };
            let data = await this.stateUtilityInst.find({ country_id: id }, projection);
            data = new StateListResponseMapper().map(data);
            response = {
                total: totalRecords,
                records: data
            }
            return response;
        } catch (e) {
            console.log("Error in getStateList() of LocationService", e);
            return Promise.reject(e);
        }
    }
    _prepareSearchCondition(filters = {}) {
        let condition = {};
        let filterArr = []
        if (filters.search) {
            filters.search = filters.search.trim()
            if (member_type == MEMBER.PLAYER) {
                let searchArr = filters.search.split(/\s+/)
                if (searchArr.length) {
                    let name = [];
                    searchArr.forEach(search => {
                        name.push({ first_name: new RegExp(search, 'i') })
                        name.push({ last_name: new RegExp(search, 'i') })
                    });
                    filterArr.push({ $or: name })
                }
                else {
                    filterArr.push({ first_name: new RegExp(filters.search, 'i') })
                    filterArr.push({ last_name: new RegExp(filters.search, 'i') })
                }
                filterArr.push({ player_type: new RegExp(filters.search, 'i') })
                filterArr.push({
                    position: {
                        $elemMatch: {
                            name: new RegExp(filters.search, "i"),
                            priority: 1
                        }
                    }
                })
            }
            else {
                filterArr.push({ name: new RegExp(filters.search, 'i') })
                let num = Number(filters.search)
                if (!isNaN(num)) {
                    if (num === 0)
                        filterArr.push({ associated_players: null })
                    filterArr.push({ associated_players: num })
                }
            }
            filterArr.push({
                email: new RegExp(filters.search, "i")
            })
            condition = {
                $or: filterArr
            };
        }
        return condition;
    }
}

module.exports = LocationService;