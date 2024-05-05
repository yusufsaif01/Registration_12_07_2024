const Promise = require("bluebird");
const errors = require("../errors");
const LoginUtility = require("../db/utilities/LoginUtility");
const TraningCenterUtility = require("../db/utilities/TraningCenterUtility");
const ClubAcademyUtility = require("../db/utilities/ClubAcademyUtility");
const uuid = require("uuid/v4");
const AuthUtility = require("../db/utilities/AuthUtility");
const EmailService = require("./EmailService");
const _ = require("lodash");
const AdminUtility = require("../db/utilities/AdminUtility");
const FootPlayerUtility = require("../db/utilities/FootPlayerUtility");
const crypto= require('crypto')
class CreateTraningCenterService {
  
  constructor() {
    this.traningCenterUtilityInst = new TraningCenterUtility();
    this.clubAcademyUtilityInst = new ClubAcademyUtility();
    this.loginUtilityInst = new LoginUtility();
    this.authUtilityInst = new AuthUtility();
    this.emailService = new EmailService();
    this.adminUtilityInst = new AdminUtility();
    this.footPlayerUtilityInst = new FootPlayerUtility();
  }

  async createTraningCenter(userData={}) {
    try {
      userData.user_id = uuid();
      const dataForMongo = userData;
      await this.traningCenterUtilityInst.insert(userData, dataForMongo);
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
}

module.exports = CreateTraningCenterService;
