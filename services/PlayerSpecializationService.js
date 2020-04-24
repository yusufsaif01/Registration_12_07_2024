const _ = require("lodash");
const errors = require("../errors");
const AbilityUtility = require('../db/utilities/AbilityUtility');
const ParameterUtility = require('../db/utilities/ParameterUtility');
const AbilityListResponseMapper = require("../dataModels/responseMapper/AbilityListResponseMapper");

class PlayerSpecializationService {

    constructor() {
        this.abilityUtilityInst = new AbilityUtility();
        this.parameterUtilityInst = new ParameterUtility();
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
    async editAbility(data = {}) {
        try {
            let foundAbility = await this.abilityUtilityInst.findOne({ id: data.ability_id });
            if (_.isEmpty(foundAbility)) {
                return Promise.reject(new errors.NotFound("Ability not found"));
            }
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
            await this.abilityUtilityInst.updateOne({ id: data.ability_id }, { name: reqObj.name })
            Promise.resolve()
        } catch (e) {
            console.log("Error in editAbility() of PlayerSpecializationService", e);
            return Promise.reject(e);
        }
    }
    async addParameter(data = {}) {
        try {
            let reqObj = data.reqObj;
            let foundAbility = await this.abilityUtilityInst.findOne({ id: reqObj.ability_id });
            if (_.isEmpty(foundAbility)) {
                return Promise.reject(new errors.NotFound("Ability not found"));
            }
            reqObj.name = reqObj.name.trim().replace(/\s\s+/g, ' ');
            if (_.isEmpty(reqObj.name)) {
                return Promise.reject(new errors.ValidationFailed("name cannot be empty"));
            }
            let regex = new RegExp(["^", reqObj.name, "$"].join(""), "i");
            const parameter = await this.parameterUtilityInst.findOne({ name: regex, ability_id: reqObj.ability_id });
            if (!_.isEmpty(parameter)) {
                return Promise.reject(new errors.Conflict("Parameter already added"));
            }
            await this.parameterUtilityInst.insert({ name: reqObj.name, ability_id: reqObj.ability_id })
            Promise.resolve()
        } catch (e) {
            console.log("Error in addParameter() of PlayerSpecializationService", e);
            return Promise.reject(e);
        }
    }
}

module.exports = PlayerSpecializationService;