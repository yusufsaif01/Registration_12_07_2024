const _ = require("lodash");
const errors = require("../errors");
const AbilityUtility = require('../db/utilities/AbilityUtility');
const AttributeUtility = require('../db/utilities/AttributeUtility');
const PositionUtility = require('../db/utilities/PositionUtility');
const AbilityListResponseMapper = require("../dataModels/responseMapper/AbilityListResponseMapper");
const AttributeListResponseMapper = require("../dataModels/responseMapper/AttributeListResponseMapper");
const PositionListResponseMapper = require("../dataModels/responseMapper/PositionListResponseMapper");
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const PlayerUtility = require('../db/utilities/PlayerUtility')

class PlayerSpecializationService {

    constructor() {
        this.abilityUtilityInst = new AbilityUtility();
        this.attributeUtilityInst = new AttributeUtility();
        this.positionUtilityInst = new PositionUtility();
        this.playerUtilityInst = new PlayerUtility();
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

    async getAttributeList(ability_id) {
        try {
            let response = {}, totalRecords = 0;
            let foundAbility = await this.abilityUtilityInst.findOne({ id: ability_id });
            if (_.isEmpty(foundAbility)) {
                return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.ABILITY_NOT_FOUND));
            }
            totalRecords = await this.attributeUtilityInst.countList({ ability_id: ability_id });
            let projection = { id: 1, name: 1 }
            let data = await this.attributeUtilityInst.find({ ability_id: ability_id }, projection);
            data = new AttributeListResponseMapper().map(data);
            let abilityName = "";
            abilityName = foundAbility.name ? foundAbility.name : "";
            response = {
                ability: abilityName,
                total: totalRecords,
                records: data
            }
            return response;
        } catch (e) {
            console.log("Error in getAttributeList() of PlayerSpecializationService", e);
            return Promise.reject(e);
        }
    }
    
    async addPositions(data = []) {
        try {
            await this.positionUtilityInst.insertMany(data)
        } catch (err) {
            return err;
        }
    }

    async getPositionList() {
        try {
            let response = {}, totalRecords = 0;
            totalRecords = await this.positionUtilityInst.countList({});
            let data = await this.positionUtilityInst.aggregate([
                { $sort: { createdAt: -1 } },
                {
                    $lookup: { from: "abilities", localField: "abilities", foreignField: "id", as: "output" }
                },
                {
                    $project: {
                        id: 1, name: 1, abbreviation: 1,
                        abilities: { $map: { input: "$output", as: "ability", in: { id: "$$ability.id", name: "$$ability.name" } } }
                    }
                }])
            data = new PositionListResponseMapper().map(data);
            response = {
                total: totalRecords,
                records: data
            }
            return response;
        } catch (e) {
            console.log("Error in getPositionList() of PlayerSpecializationService", e);
            return Promise.reject(e);
        }
    }
}

module.exports = PlayerSpecializationService;