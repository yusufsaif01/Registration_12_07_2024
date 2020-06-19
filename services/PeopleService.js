const errors = require("../errors");
const _ = require("lodash");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const PlayerUtility = require("../db/utilities/PlayerUtility");
const LoginUtility = require("../db/utilities/LoginUtility");
const Role = require("../constants/Role");

const loginInst = new LoginUtility();

class PeopleService {
  constructor() {}

  async listAll(params) {
    try {
      const aggregatePipes = [];

      this.validateParams(params);

      aggregatePipes.push(this.addMatchPipeline(params));
      aggregatePipes.push(this.addLookupPipeline());
      aggregatePipes.push(this.addProjectionPipeline());

      let records = await loginInst.aggregate(aggregatePipes);

      return Promise.resolve(records);
    } catch (error) {}
  }

  addMatchPipeline(params) {
    return {
      $match: {
        is_deleted: false,
        role: params.role || "",
      },
    };
  }

  addLookupPipeline() {
    return {
      $lookup: {
        from: "club_academy_details",
        localField: "user_id",
        foreignField: "user_id",
        as: "userDetail",
      },
    };
  }

  addProjectionPipeline() {
    return {
      $project: {
        role: 1,
        user_id: 1,
        "userDetail.name": 1,
        "userDetail.email": 1,
        "userDetail.email": 1,
      },
    };
  }

  validateParams (params) {
    if (params.role) {
      if ([Role.CLUB, Role.ACADEMY].indexOf(params.role) == -1) {
        params.role = ''
      }
    }
  };
}

module.exports = PeopleService;
