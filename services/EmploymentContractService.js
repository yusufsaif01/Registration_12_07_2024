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

  async getEmploymentContractList(requestedData = {}) {
    try {
      let paginationOptions = requestedData.paginationOptions || {};
      let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
      let options = { limit: paginationOptions.limit, skip: skipCount };
      let matchCondition = { is_deleted: false, $or: [{ sent_by: requestedData.user_id }, { send_to: requestedData.user_id }] };
      if (requestedData.role === ROLE.PLAYER || requestedData.role === ROLE.ADMIN) {
        matchCondition.status = { $ne: CONTRACT_STATUS.REJECTED }
      }
      let data = await this.employmentContractUtilityInst.aggregate([{ $match: matchCondition },
      { "$lookup": { "from": "login_details", "localField": "sent_by", "foreignField": "user_id", "as": "login_detail" } },
      { $unwind: { path: "$login_detail" } }, { "$lookup": { "from": "club_academy_details", "localField": "clubAcademyName", "foreignField": "name", "as": "clubAcademyDetail" } },
      { $unwind: { path: "$clubAcademyDetail", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, id: 1, name: "$clubAcademyName", clubAcademyUserId: "$clubAcademyDetail.user_id", effectiveDate: 1, expiryDate: 1, status: 1, created_by: "$login_detail.member_type" } },
      { $facet: { data: [{ $skip: options.skip }, { $limit: options.limit },], total_data: [{ $group: { _id: null, count: { $sum: 1 } } }] } }
      ]);
      let responseData = [], totalRecords = 0;
      if (data && data.length && data[0] && data[0].data) {
        responseData = data[0].data
        if (data[0].data.length && data[0].total_data && data[0].total_data.length && data[0].total_data[0].count) {
          totalRecords = data[0].total_data[0].count;
        }
      }
      let response = { total: totalRecords, records: responseData };
      return response;

    } catch (e) {
      console.log("Error in getEmploymentContractList() of EmploymentContractService", e);
      return Promise.reject(e);
    }
  }
}

module.exports = EmploymentContractService;
