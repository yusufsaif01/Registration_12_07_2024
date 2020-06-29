const moment = require("moment");
const LoginUtility = require("../db/utilities/LoginUtility");
const MEMBER = require("../constants/MemberType");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const _ = require("lodash");
const PlayerUtility = require("../db/utilities/PlayerUtility");
const EmploymentContractUtility = require("../db/utilities/EmploymentContractUtility");
const errors = require("../errors");
const EmailService = require("./EmailService");
const config = require("../config");
const Role = require("../constants/Role");
const ContractStatus = require("../constants/ContractStatus");
const ProfileStatus = require("../constants/ProfileStatus");
const ACCOUNT_STATUS = require("../constants/AccountStatus");
const PLAYER = require("../constants/PlayerType");
const DOCUMENT_TYPE = require("../constants/DocumentType");
const DOCUMENT_STATUS = require("../constants/DocumentStatus");
const FootPlayerUtility = require("../db/utilities/FootPlayerUtility");
const FOOT_PLAYER_STATUS = require("../constants/FootPlayerStatus");
const EmploymentContractListResponseMapper = require("../dataModels/responseMapper/EmploymentContractListResponseMapper");

class EmploymentContractService {
  constructor() {
    this.loginUtilityInst = new LoginUtility();
    this.playerUtilityInst = new PlayerUtility();
    this.emailService = new EmailService();
    this.contractInst = new EmploymentContractUtility();
    this.footPlayerInst = new FootPlayerUtility();
  }

  async createContract(body, authUser) {
    let resp = {};

    this.preHandlingCheck(body);

    if (authUser.role == Role.PLAYER) {
      if (body.clubAcademyName == "others") {
        resp = await this.createOtherContract(body, authUser);
        return Promise.resolve({
          id: resp.id,
        });
      }
      resp = await this.playerCreatingContract(body, authUser);
    }

    if ([Role.CLUB, Role.ACADEMY].indexOf(authUser.role) != -1) {
      resp = await this.clubAcademyCreatingContract(body, authUser);
    }

    return Promise.resolve({
      id: resp.id,
    });
  }
  async updateContract(contractId, body, authUser) {
    let resp = {};

    this.preHandlingCheck(body);

    if (authUser.role == "player") {
      if (body.clubAcademyName == "others") {
        resp = await this.updateOtherContract(contractId, body, authUser);
        return Promise.resolve(resp);
      }
      resp = await this.playerUpdatingContract(contractId, body, authUser);
    }

    if ([Role.CLUB, Role.ACADEMY].includes(authUser.role)) {
      resp = await this.clubAcademyUpdatingContract(contractId, body, authUser);
    }

    return Promise.resolve(resp);
  }

  preHandlingCheck(body) {
    body.status = ContractStatus.PENDING;

    this.checkExpiryDate(body);

    if (body.clubAcademyName != "others") {
      body.otherName = "";
      body.otherEmail = "";
      body.otherPhoneNumber = "";
    }
  }

  async playerCreatingContract(body, authUser) {
    await this.checkPlayerCanAcceptContract(authUser.email);
    await this.checkDuplicateContract(authUser.email, body.clubAcademyEmail);

    body.sent_by = authUser.user_id;
    let clubOrAcademy = await this.findClubAcademyByEmail(
      body.clubAcademyEmail,
      body.category
    );

    body.send_to = clubOrAcademy.user_id;
    body.playerEmail = authUser.email;

    let created = await this.contractInst.insert(body);

    return Promise.resolve(created);
  }

  async createOtherContract(body, authUser) {
    await this.checkPlayerCanAcceptContract(authUser.email);
    await this.checkOtherDuplicateContract(authUser.email, body.otherEmail);

    body.sent_by = authUser.user_id;
    body.send_to = null;
    body.playerEmail = authUser.email;
    body.clubAcademyName = body.otherName;

    let created = await this.contractInst.insert(body);

    return Promise.resolve(created);
  }
  async updateOtherContract(contractId, body, authUser) {
    await this.userCanUpdateContract(authUser.user_id, contractId);
    await this.checkPlayerCanAcceptContract(authUser.email);
    await this.checkOtherDuplicateContract(authUser.email, body.otherEmail);

    body.sent_by = authUser.user_id;
    body.send_to = null;
    body.playerEmail = authUser.email;
    body.clubAcademyName = body.otherName;

    await this.contractInst.updateOne(
      {
        id: contractId,
        sent_by: authUser.user_id,
        is_deleted: false,
        status: { $in: [ContractStatus.PENDING, ContractStatus.DISAPPROVED] },
      },
      body
    );

    return Promise.resolve();
  }

  async clubAcademyCreatingContract(body, authUser) {
    body.sent_by = authUser.user_id;
    let player = await this.findPlayerByEmail(body.playerEmail);

    await this.checkPlayerCanAcceptContract(player.username);
    await this.checkDuplicateContract(player.username, authUser.email);
    await this.checkConnectionExists(authUser.user_id, player.user_id);

    body.send_to = player.user_id;
    body.playerEmail = player.username;

    let created = await this.contractInst.insert(body);

    return Promise.resolve(created);
  }

  /**
   * Checks whether connection exists or not
   * @param {string} sentBy Club/Academy ID
   * @param {string} sendTo Player ID
   */
  async checkConnectionExists(sentBy, sendTo) {
    let connection = await this.footPlayerInst.findOne({
      sent_by: sentBy,
      "send_to.user_id": sendTo,
      // status: FOOT_PLAYER_STATUS.ADDED,
      is_deleted: false,
    });

    if (!connection) {
      throw new errors.ValidationFailed(
        "Profile is not in your foot player list."
      );
    }

    if (connection.status != FOOT_PLAYER_STATUS.ADDED) {
      throw new errors.ValidationFailed(
        "Profile foot player request is not approved or added."
      );
    }
  }

  async playerUpdatingContract(contractId, body, authUser) {
    await this.userCanUpdateContract(authUser.user_id, contractId);

    await this.checkPlayerCanAcceptContract(authUser.email);
    await this.checkDuplicateContract(
      authUser.email,
      body.clubAcademyEmail,
      contractId
    );

    body.sent_by = authUser.user_id;
    let clubOrAcademy = await this.findClubAcademyByEmail(
      body.clubAcademyEmail,
      body.category
    );

    body.send_to = clubOrAcademy.user_id;
    body.playerEmail = authUser.email;

    await this.contractInst.updateOne(
      {
        id: contractId,
        sent_by: authUser.user_id,
        is_deleted: false,
        status: { $in: [ContractStatus.PENDING, ContractStatus.DISAPPROVED] },
      },
      body
    );

    return Promise.resolve();
  }

  async clubAcademyUpdatingContract(contractId, body, authUser) {
    await this.userCanUpdateContract(authUser.user_id, contractId);

    body.sent_by = authUser.user_id;

    let player = await this.findPlayerByEmail(body.playerEmail);

    await this.checkPlayerCanAcceptContract(player.username);
    await this.checkDuplicateContract(
      player.username,
      authUser.email,
      contractId
    );
    await this.checkConnectionExists(authUser.user_id, player.user_id);

    body.send_to = player.user_id;
    body.playerEmail = player.username;

    await this.contractInst.updateOne(
      {
        id: contractId,
        sent_by: authUser.user_id,
        is_deleted: false,
        status: { $in: [ContractStatus.PENDING, ContractStatus.DISAPPROVED] },
      },
      body
    );

    return Promise.resolve();
  }

  /**
   * Accept contract only if there is no active contract
   * @param {string} playerEmail
   */
  async checkPlayerCanAcceptContract(playerEmail) {
    let exists = await this.contractInst.findOne({
      playerEmail: playerEmail,
      status: { $in: [ContractStatus.ACTIVE, ContractStatus.YET_TO_START] },
      is_deleted: false,
    });

    if (exists) {
      throw new errors.BadRequest("Player already have an active contract");
    }
  }

  async checkDuplicateContract(playerEmail, clubAcademyEmail, ignore = false) {
    const $where = {
      playerEmail: playerEmail,
      clubAcademyEmail: clubAcademyEmail,
      status: ContractStatus.PENDING,
      is_deleted: false,
    };

    if (ignore) {
      $where["id"] = { $ne: ignore };
    }

    await this.findOrFail($where);
  }
  async checkOtherDuplicateContract(playerEmail, otherEmail, ignore = false) {
    const $where = {
      playerEmail: playerEmail,
      otherEmail: otherEmail,
      status: ContractStatus.PENDING,
      is_deleted: false,
    };

    if (ignore) {
      $where["id"] = { $ne: ignore };
    }

    await this.findOrFail($where);
  }

  async findOrFail($where) {
    let exists = await this.contractInst.findOne($where);

    if (exists) {
      throw new errors.BadRequest("Contract already exists");
    }
  }

  async findClubAcademyByEmail(email, category) {
    return await this.findLoginByUser(email, category);
  }

  async findLoginByUser(email, category) {
    const $where = {
      username: email,
      role: category,
      is_deleted: false,
    };

    let user = await this.loginUtilityInst.findOne($where);

    if (!user) {
      throw new errors.NotFound(`${category} does not exists`);
    }

    if (
      category != Role.PLAYER &&
      user.profile_status.status != ProfileStatus.VERIFIED
    ) {
      throw new errors.ValidationFailed(`${category} profile is not verified.`);
    }

    if (user.status != ACCOUNT_STATUS.ACTIVE) {
      throw new errors.ValidationFailed(`${category} profile is suspended.`);
    }

    return user;
  }

  async findPlayerByEmail(email) {
    return await this.findLoginByUser(email, Role.PLAYER);
  }

  checkExpiryDate(body) {
    if (moment(body.expiryDate).diff(body.effectiveDate, "years") > 5) {
      throw new errors.ValidationFailed(
        "The expiry date cannot exceed 5 years of effective date"
      );
    }
  }

  async userCanUpdateContract(userId, contractId) {
    let contract = await this.contractInst.findOne({
      sent_by: userId, // who creates contract can update the contract
      id: contractId,
      is_deleted: false,
    });

    if (!contract) {
      throw new errors.NotFound();
    }

    if (
      [ContractStatus.PENDING, ContractStatus.DISAPPROVED].indexOf(
        contract.status
      ) == -1
    ) {
      throw new errors.Unauthorized("Cannot update already approved contract.");
    }
  }

  async deleteContract(contractId, authUser) {
    let res = await this.contractInst.updateOne(
      {
        sent_by: authUser.user_id, // contract created by the user can only delete the contract.
        id: contractId,
        is_deleted: false,
        status: { $in: [ContractStatus.PENDING, ContractStatus.DISAPPROVED] }, // delete only pending or disapproved
      },
      {
        is_deleted: true,
        deleted_at: new Date(),
      }
    );

    if (res.nModified) {
      return Promise.resolve();
    }

    throw new errors.NotFound();
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
      let foundUser = await this.loginUtilityInst.findOne(
        { user_id: data.sent_by },
        { member_type: 1 }
      );
      data.created_by = foundUser ? foundUser.member_type : "";
      return data;
    } catch (e) {
      console.log(
        "Error in getEmploymentContractDetails() of EmploymentContractService",
        e
      );
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
    let data = await this.contractInst.findOne(
      { id: requestedData.id },
      { createdAt: 0, updatedAt: 0, _id: 0, __v: 0 }
    );
    if (!data) {
      return Promise.reject(
        new errors.NotFound(RESPONSE_MESSAGE.EMPLOYMENT_CONTRACT_NOT_FOUND)
      );
    }
    let user = requestedData.user;
    if (
      user.role !== Role.ADMIN &&
      user.email !== data.playerEmail &&
      user.email !== data.clubAcademyEmail
    ) {
      return Promise.reject(
        new errors.ValidationFailed(
          RESPONSE_MESSAGE.EMPLOYMENT_CONTRACT_ACCESS_DENIED
        )
      );
    }
    return Promise.resolve(data);
  }

  /**
   * get list of contracts related to logged in user
   *
   * @param {*} [requestedData={}]
   * @returns
   * @memberof EmploymentContractService
   */
  async getEmploymentContractList(requestedData = {}) {
    try {
      let paginationOptions = requestedData.paginationOptions || {};
      let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
      let options = { limit: paginationOptions.limit, skip: skipCount };
      let matchCondition = {
        is_deleted: false,
        $or: [
          { sent_by: requestedData.user_id },
          { send_to: requestedData.user_id },
        ],
      };
      if (
        requestedData.role === Role.PLAYER ||
        requestedData.role === Role.ADMIN
      ) {
        matchCondition.status = { $ne: ContractStatus.REJECTED };
      }
      let data = await this.contractInst.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: "login_details",
            localField: "sent_by",
            foreignField: "user_id",
            as: "login_detail",
          },
        },
        { $unwind: { path: "$login_detail" } },
        {
          $lookup: {
            from: "club_academy_details",
            localField: "clubAcademyEmail",
            foreignField: "email",
            as: "clubAcademyDetail",
          },
        },
        {
          $unwind: {
            path: "$clubAcademyDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "player_details",
            localField: "playerEmail",
            foreignField: "email",
            as: "playerDetail",
          },
        },
        {
          $unwind: {
            path: "$playerDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            name: { $cond: { if: { $eq: [requestedData.role, Role.PLAYER] }, then: "$clubAcademyName", else: "$playerName" } },
            clubAcademyUserId: "$clubAcademyDetail.user_id",
            avatar: { $cond: { if: { $eq: [requestedData.role, Role.PLAYER] }, then: "$clubAcademyDetail.avatar_url", else: "$playerDetail.avatar_url" } },
            effectiveDate: 1,
            expiryDate: 1,
            status: 1,
            created_by: "$login_detail.member_type",
            canUpdateStatus: { $cond: { if: { $eq: [requestedData.user_id, "$send_to"] }, then: true, else: false } }
          },
        },
        {
          $facet: {
            data: [{ $skip: options.skip }, { $limit: options.limit }],
            total_data: [{ $group: { _id: null, count: { $sum: 1 } } }],
          },
        },
      ]);
      let responseData = [],
        totalRecords = 0;
      if (data && data.length && data[0] && data[0].data) {
        responseData = new EmploymentContractListResponseMapper().map(data[0].data);
        if (
          data[0].data.length &&
          data[0].total_data &&
          data[0].total_data.length &&
          data[0].total_data[0].count
        ) {
          totalRecords = data[0].total_data[0].count;
        }
      }
      let response = { total: totalRecords, records: responseData };
      return response;
    } catch (e) {
      console.log(
        "Error in getEmploymentContractList() of EmploymentContractService",
        e
      );
      return Promise.reject(e);
    }
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
      let { isSendToPlayer, data } = await this.isAllowedToUpdateStatus(
        requestedData
      );
      let sentByUser = await this.loginUtilityInst.findOne(
        { user_id: data.sent_by },
        { username: 1, member_type: 1 }
      );
      let playerName = "",
        playerUserId = "",
        playerType = "",
        documents = [];
      if (isSendToPlayer || sentByUser.member_type === MEMBER.PLAYER) {
        playerUserId = isSendToPlayer ? data.send_to : data.sent_by;
        let player = await this.playerUtilityInst.findOne(
          { user_id: playerUserId },
          { first_name: 1, last_name: 1, player_type: 1, documents: 1 }
        );
        playerName = `${player.first_name} ${player.last_name}`;
        playerType = player.player_type;
        documents = player.documents;
      }
      let reqObj = requestedData.reqObj;
      if (reqObj.status === ContractStatus.APPROVED) {
        await this.checkForActiveContract({
          id: requestedData.id,
          playerUserId: playerUserId,
        });
        let status = this.getEmploymentContractStatus(data);
        await this.contractInst.updateOne(
          { id: requestedData.id },
          { status: status }
        );
        await this.rejectOtherContracts({
          id: requestedData.id,
          playerUserId: playerUserId,
        });
        await this.convertToProfessional({
          playerUserId: playerUserId,
          playerType: playerType,
        });
        await this.updateProfileStatus({
          playerUserId: playerUserId,
          documents: documents,
          status: reqObj.status,
        });
        await this.emailService.employmentContractApproval({
          email: sentByUser.username,
          name: playerName,
        });
      }
      if (reqObj.status === ContractStatus.DISAPPROVED) {
        await this.contractInst.updateOne(
          { id: requestedData.id },
          { status: ContractStatus.DISAPPROVED }
        );
        await this.updateProfileStatus({
          playerUserId: playerUserId,
          documents: documents,
          status: reqObj.status,
        });
        await this.emailService.employmentContractDisapproval({
          email: sentByUser.username,
          name: playerName,
          reason: reqObj.remarks,
        });
      }
      return Promise.resolve();
    } catch (e) {
      console.log(
        "Error in updateEmploymentContractStatus() of EmploymentContractService",
        e
      );
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
      let foundUser = await this.loginUtilityInst.findOne({
        user_id: data.send_to,
      });
      if (!foundUser && user.role !== Role.ADMIN) {
        return Promise.reject(
          new errors.ValidationFailed(
            RESPONSE_MESSAGE.CANNOT_UPDATE_CONTRACT_STATUS
          )
        );
      }
      if (foundUser) {
        if (user.user_id !== foundUser.user_id) {
          return Promise.reject(
            new errors.ValidationFailed(
              RESPONSE_MESSAGE.CANNOT_UPDATE_CONTRACT_STATUS
            )
          );
        }
        if (foundUser.member_type === MEMBER.PLAYER) {
          isSendToPlayer = true;
        }
      }
    }
    if (!data.send_to && user.role !== Role.ADMIN) {
      return Promise.reject(
        new errors.ValidationFailed(
          RESPONSE_MESSAGE.CANNOT_UPDATE_CONTRACT_STATUS
        )
      );
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
      return ContractStatus.YET_TO_START;
    }
    if (expiryDate > dateNow) {
      return ContractStatus.ACTIVE;
    }
    if (expiryDate <= dateNow) {
      return ContractStatus.COMPLETED;
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
      let condition = {
        status: ContractStatus.PENDING,
        id: { $ne: requestedData.id },
        $or: [
          { sent_by: requestedData.playerUserId },
          { send_to: requestedData.playerUserId },
        ],
      };
      await this.contractInst.updateMany(condition, {
        status: ContractStatus.REJECTED,
      });
      return Promise.resolve();
    } catch (e) {
      console.log(
        "Error in rejectOtherContracts() of EmploymentContractService",
        e
      );
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
        await this.playerUtilityInst.updateOne(
          { user_id: requestedData.playerUserId },
          { player_type: PLAYER.PROFESSIONAL }
        );
      }
      return Promise.resolve();
    } catch (e) {
      console.log(
        "Error in convertToProfessional() of EmploymentContractService",
        e
      );
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
      let profileStatus = ProfileStatus.NON_VERIFIED;
      if (requestedData.status === ContractStatus.DISAPPROVED) {
        profileStatus = ProfileStatus.NON_VERIFIED;
      }
      if (requestedData.status === ContractStatus.APPROVED) {
        let aadhaar = _.find(requestedData.documents, {
          type: DOCUMENT_TYPE.AADHAR,
        });
        if (aadhaar && aadhaar.status === DOCUMENT_STATUS.APPROVED)
          profileStatus = ProfileStatus.VERIFIED;
      }
      await this.loginUtilityInst.updateOne(
        { user_id: requestedData.playerUserId },
        { "profile_status.status": profileStatus }
      );
      return Promise.resolve();
    } catch (e) {
      console.log(
        "Error in updateProfileStatus() of EmploymentContractService",
        e
      );
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
      let condition = {
        status: ContractStatus.ACTIVE,
        $or: [
          { sent_by: requestedData.playerUserId },
          { send_to: requestedData.playerUserId },
        ],
      };
      let foundContract = await this.contractInst.findOne(condition, { id: 1 });
      if (foundContract && requestedData.id !== foundContract.id) {
        return Promise.reject(
          new errors.Conflict(RESPONSE_MESSAGE.ANOTHER_ACTIVE_CONTRACT_EXIST)
        );
      }
      return Promise.resolve();
    } catch (e) {
      console.log(
        "Error in checkForActiveContracts() of EmploymentContractService",
        e
      );
      return Promise.reject(e);
    }
  }
}

module.exports = EmploymentContractService;
