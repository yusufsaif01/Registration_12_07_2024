const LoginUtility = require("../db/utilities/LoginUtility");
const MEMBER = require("../constants/MemberType");
const PROFILE_STATUS = require("../constants/ProfileStatus");
const CONTRACT_STATUS = require("../constants/ContractStatus");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const _ = require("lodash");
const PlayerUtility = require("../db/utilities/PlayerUtility");
const EmploymentContractUtility = require("../db/utilities/EmploymentContractUtility");
const errors = require("../errors");
const EmailService = require("./EmailService");
const config = require("../config");
const ROLE = require("../constants/Role");

class EmploymentContractService {
  constructor() {
    this.loginUtilityInst = new LoginUtility();
    this.playerUtilityInst = new PlayerUtility();
    this.emailService = new EmailService();
    this.employmentContractUtilityInst = new EmploymentContractUtility();
  }

  /**
   * get employment contract details
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async getEmploymentContractDetails(requestedData = {}) {
    try {
      let data = await this.checkEmploymentContractAccess(requestedData);
      let foundUser = await this.loginUtilityInst.findOne({ user_id: data.sent_by }, { member_type: 1 });
      data.created_by = foundUser ? foundUser.member_type : "";
      return data;
    } catch (e) {
      console.log("Error in getEmploymentContractDetails() of EmploymentContractService", e);
      return Promise.reject(e);
    }
  }

  /**
   * checks if the logged_in user can view employment contract
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async checkEmploymentContractAccess(requestedData = {}) {
    let data = await this.employmentContractUtilityInst.findOne({ id: requestedData.id }, { createdAt: 0, updatedAt: 0, _id: 0, __v: 0 });
    if (!data) {
      return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.EMPLOYMENT_CONTRACT_NOT_FOUND));
    }
    let user = requestedData.user;
    if (user.role !== ROLE.ADMIN && user.email !== data.playerEmail && user.email !== data.clubAcademyEmail) {
      return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.EMPLOYMENT_CONTRACT_ACCESS_DENIED));
    }
    return Promise.resolve(data);
  }
}

module.exports = EmploymentContractService;
