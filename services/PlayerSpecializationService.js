const _ = require("lodash");
const errors = require("../errors");
const AbilityUtility = require('../db/utilities/AbilityUtility');
const AbilityListResponseMapper = require("../dataModels/responseMapper/AbilityListResponseMapper");

class PlayerSpecializationService {

    constructor() {
        this.abilityUtilityInst = new AbilityUtility();
    }
    async addAbility(data = {}) {
        try {
            let reqObj = data.reqObj;
            reqObj.name = reqObj.name.trim().replace(/\s\s+/g, ' ');
            if (_.isEmpty(reqObj.name)) {
                return Promise.reject(new errors.ValidationFailed("name cannot be empty"));
            }
            let regex = new RegExp(["^", reqObj.name, "$"].join(""), "i");
            const ability = await this.abilityUtilityInst.findOne({ name: regex });
            if (!_.isEmpty(ability)) {
                return Promise.reject(new errors.Conflict("Ability already added"));
            }
            await this.abilityUtilityInst.insert({ name: reqObj.name })
            Promise.resolve()
        } catch (e) {
            console.log("Error in addAbility() of PlayerSpecializationService", e);
            return Promise.reject(e);
        }
    }
    async getAbilityList() {
        try {
            let response = {}, totalRecords = 0;
            totalRecords = await this.abilityUtilityInst.countList({});
            let projection = { id: 1, name: 1 }
            let data = await this.abilityUtilityInst.find({}, projection);
            data = new AbilityListResponseMapper().map(data);
            response = {
                total: totalRecords,
                records: data
            }
            return response;
        } catch (e) {
            console.log("Error in getAbilityList() of PlayerSpecializationService", e);
            return Promise.reject(e);
        }
    }
}

module.exports = PlayerSpecializationService;