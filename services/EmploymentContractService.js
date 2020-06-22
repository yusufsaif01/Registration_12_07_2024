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
const moment = require('moment');
const PLAYER = require("../constants/PlayerType");
const DOCUMENT_TYPE = require('../constants/DocumentType');
const DOCUMENT_STATUS = require('../constants/DocumentStatus')

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

  /**
   * updates employment contract status
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async updateEmploymentContractStatus(requestedData = {}) {
    try {
      let { isSendToPlayer, data } = await this.isAllowedToUpdateStatus(requestedData);
      let sentByUser = await this.loginUtilityInst.findOne({ user_id: data.sent_by }, { username: 1, member_type: 1 });
      let playerName = "", playerUserId = "", playerType = "", documents = [];
      if (isSendToPlayer || sentByUser.member_type === MEMBER.PLAYER) {
        playerUserId = isSendToPlayer ? data.send_to : data.sent_by;
        let player = await this.playerUtilityInst.findOne({ user_id: playerUserId }, { first_name: 1, last_name: 1, player_type: 1, documents: 1 });
        playerName = `${player.first_name} ${player.last_name}`;
        playerType = player.player_type;
        documents = player.documents;
      }
      let reqObj = requestedData.reqObj;
      if (reqObj.status === CONTRACT_STATUS.APPROVED) {
        await this.checkForActiveContract({ id: requestedData.id, playerUserId: playerUserId });
        let status = this.getEmploymentContractStatus(data);
        await this.employmentContractUtilityInst.updateOne({ id: requestedData.id }, { status: status });
        await this.rejectOtherContracts({ id: requestedData.id, playerUserId: playerUserId });
        await this.convertToProfessional({ playerUserId: playerUserId, playerType: playerType });
        await this.updateProfileStatus({ playerUserId: playerUserId, documents: documents, status: reqObj.status });
        await this.emailService.employmentContractApproval({ email: sentByUser.username, name: playerName });
      }
      if (reqObj.status === CONTRACT_STATUS.DISAPPROVED) {
        await this.employmentContractUtilityInst.updateOne({ id: requestedData.id }, { status: CONTRACT_STATUS.DISAPPROVED });
        await this.updateProfileStatus({ playerUserId: playerUserId, documents: documents, status: reqObj.status });
        await this.emailService.employmentContractDisapproval({ email: sentByUser.username, name: playerName, reason: reqObj.remarks });
      }
      return Promise.resolve();
    } catch (e) {
      console.log("Error in updateEmploymentContractStatus() of EmploymentContractService", e);
      return Promise.reject(e);
    }
  }

  /**
   * checks if the logged_in user is allowed to update employment contract status
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async isAllowedToUpdateStatus(requestedData = {}) {
    let data = await this.checkEmploymentContractAccess(requestedData);
    let user = requestedData.user;
    let isSendToPlayer = false;
    if (data.send_to) {
      let foundUser = await this.loginUtilityInst.findOne({ user_id: data.send_to });
      if (!foundUser && user.role !== ROLE.ADMIN) {
        return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_UPDATE_CONTRACT_STATUS));
      }
      if (foundUser) {
        if (user.user_id !== foundUser.user_id) {
          return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_UPDATE_CONTRACT_STATUS));
        }
        if (foundUser.member_type === MEMBER.PLAYER) {
          isSendToPlayer = true
        }
      }
    }
    if (!data.send_to && user.role !== ROLE.ADMIN) {
      return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CANNOT_UPDATE_CONTRACT_STATUS));
    }
    return Promise.resolve({ isSendToPlayer: isSendToPlayer, data: data });
  }

  /**
   * returns status for to be approved employment contract 
   *
   * @param {*} data
   * @returns
   * @memberof EmploymentContractService
   */
  getEmploymentContractStatus(data) {
    let date = new Date();
    let dateNow = moment(date).format("YYYY-MM-DD");
    let effectiveDate = moment(data.effectiveDate).format("YYYY-MM-DD");
    let expiryDate = moment(data.expiryDate).format("YYYY-MM-DD");
    if (dateNow < effectiveDate) {
      return CONTRACT_STATUS.YET_TO_START;
    }
    if (expiryDate > dateNow) {
      return CONTRACT_STATUS.ACTIVE;
    }
    if (expiryDate <= dateNow) {
      return CONTRACT_STATUS.COMPLETED;
    }
  }

  /**
   * rejects other contracts related to player
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async rejectOtherContracts(requestedData = {}) {
    try {
      let condition = { status: CONTRACT_STATUS.PENDING, id: { $ne: requestedData.id }, $or: [{ sent_by: requestedData.playerUserId }, { send_to: requestedData.playerUserId }] };
      await this.employmentContractUtilityInst.updateMany(condition, { status: CONTRACT_STATUS.REJECTED });
      return Promise.resolve();
    } catch (e) {
      console.log("Error in rejectOtherContracts() of EmploymentContractService", e);
      return Promise.reject(e);
    }
  }

  /**
   * updates player type to professional
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async convertToProfessional(requestedData = {}) {
    try {
      if (requestedData.playerType !== PLAYER.PROFESSIONAL) {
        await this.playerUtilityInst.updateOne({ user_id: requestedData.playerUserId }, { player_type: PLAYER.PROFESSIONAL });
      }
      return Promise.resolve();
    } catch (e) {
      console.log("Error in convertToProfessional() of EmploymentContractService", e);
      return Promise.reject(e);
    }
  }

  /**
   * updates profile status of player
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async updateProfileStatus(requestedData = {}) {
    try {
      let profileStatus = PROFILE_STATUS.NON_VERIFIED;
      if (requestedData.status === CONTRACT_STATUS.DISAPPROVED) {
        profileStatus = PROFILE_STATUS.NON_VERIFIED;
      }
      if (requestedData.status === CONTRACT_STATUS.APPROVED) {
        let aadhaar = _.find(requestedData.documents, { type: DOCUMENT_TYPE.AADHAR });
        if (aadhaar && aadhaar.status === DOCUMENT_STATUS.APPROVED)
          profileStatus = PROFILE_STATUS.VERIFIED;
      }
      await this.loginUtilityInst.updateOne({ user_id: requestedData.playerUserId }, { "profile_status.status": profileStatus });
      return Promise.resolve();
    } catch (e) {
      console.log("Error in updateProfileStatus() of EmploymentContractService", e);
      return Promise.reject(e);
    }
  }

  /**
   * checks for other active contracts
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async checkForActiveContract(requestedData = {}) {
    try {
      let condition = { status: CONTRACT_STATUS.ACTIVE, $or: [{ sent_by: requestedData.playerUserId }, { send_to: requestedData.playerUserId }] };
      let foundContract = await this.employmentContractUtilityInst.findOne(condition, { id: 1 });
      if (foundContract && requestedData.id !== foundContract.id) {
        return Promise.reject(new errors.Conflict(RESPONSE_MESSAGE.ANOTHER_ACTIVE_CONTRACT_EXIST));
      }
      return Promise.resolve();
    } catch (e) {
      console.log("Error in checkForActiveContracts() of EmploymentContractService", e);
      return Promise.reject(e);
    }
  }
}

module.exports = EmploymentContractService;
