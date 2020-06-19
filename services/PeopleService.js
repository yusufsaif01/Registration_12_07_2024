const errors = require("../errors");
const _ = require("lodash");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const PlayerUtility = require("../db/utilities/PlayerUtility");

class PeopleService {
  constructor() {}

  listAll(params) {
    try {
      return Promise.resolve({message: 'People endpoint'})
    } catch (error) {
      
    }
  }
}

module.exports = PeopleService;
