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
const ClubAcademyUtility = require("../db/utilities/ClubAcademyUtility");
const AdminUtility = require("../db/utilities/AdminUtility");
const {map} = require('bluebird');

class EmploymentContractService {
  constructor() {
    this.loginUtilityInst = new LoginUtility();
    this.playerUtilityInst = new PlayerUtility();
    this.emailService = new EmailService();
    this.contractInst = new EmploymentContractUtility();
    this.footPlayerInst = new FootPlayerUtility();
    this.clubAcademyInst = new ClubAcademyUtility();
    this.adminUtilityInst = new AdminUtility();
  }

  async createContract(body, authUser) {
    let resp = {};

    this.preHandlingCheck(body);

    if (authUser.role == Role.PLAYER) {
      if (body.club_academy_name == "Others") {
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
      if (body.club_academy_name == "Others") {
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

    if (body.club_academy_name != "Others") {
      body.other_name = "";
      body.other_email = "";
      body.other_phone_number = "";
    }
  }

  async playerCreatingContract(body, authUser) {
    await this.checkPlayerCanAcceptContract(authUser.email);
    await this.checkDuplicateContract(
      body.player_email,
      body.club_academy_email
    );

    body.sent_by = authUser.user_id;
    let clubOrAcademy = await this.findClubAcademyLogin(
      body.user_id,
      body.category
    );

    body.send_to = clubOrAcademy.user_id;

    let created = await this.contractInst.insert(body);

    let playerDetails = await this.getPlayerDetails(authUser.user_id);
    let clubAcademyDetails = await this.getClubDetails(clubOrAcademy.user_id);

    this.sendCreatedNotification(
      clubOrAcademy.username,
      clubAcademyDetails.name,
      playerDetails.first_name,
      "player_to_club_acad",
      body.category
    );

    return Promise.resolve(created);
  }

  async sendCreatedNotification(email, name, from, type, category = '') {

    let mappings = {
      club_acad_to_user: "employmentContractCreatedClubAcademy",
      player_to_club_acad: "employmentContractCreatedPlayer",
    };

    if (!mappings[type]) {
      throw new errors.Internal('Specified email does not exists.');
    }
    
    await this.emailService.sendMail(mappings[type], {
      email: email,
      name: name,
      from: from,
      category,
    });
  }

  async getClubDetails(userID) {
    return await this.clubAcademyInst.findOne({
      user_id: userID,
    });
  }
  async getPlayerDetails(userID) {
    return await this.playerUtilityInst.findOne({
      user_id: userID,
    });
  }

  async createOtherContract(body, authUser) {
    await this.checkPlayerCanAcceptContract(authUser.email);
    await this.checkOtherDuplicateContract(authUser.email, body.other_email);

    body.sent_by = authUser.user_id;
    body.send_to = null;
    body.club_academy_email = null;
    let created = await this.contractInst.insert(body);

    return Promise.resolve(created);
  }
  async updateOtherContract(contractId, body, authUser) {
    await this.userCanUpdateContract(authUser.user_id, contractId);
    await this.checkPlayerCanAcceptContract(authUser.email);
    await this.checkOtherDuplicateContract(
      authUser.email,
      body.other_email,
      contractId
    );

    body.sent_by = authUser.user_id;
    body.send_to = null;
    body.club_academy_email = null;

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
    let player = await this.findPlayerLogin(body.user_id);

    await this.checkPlayerCanAcceptContract(player.username);
    await this.checkDuplicateContract(
      body.player_email,
      body.club_academy_email
    );
    await this.checkConnectionExists(authUser.user_id, player.user_id);

    body.send_to = player.user_id;

    let created = await this.contractInst.insert(body);

    const clubAcademyDetails = await this.getClubDetails(authUser.user_id);
    const playerDetails = await this.getPlayerDetails(player.user_id);

    this.sendCreatedNotification(
      player.username,
      playerDetails.first_name,
      clubAcademyDetails.name,
      "club_acad_to_user",
      authUser.role
    );

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
      body.player_email,
      body.club_academy_email,
      contractId
    );

    body.sent_by = authUser.user_id;
    let clubOrAcademy = await this.findClubAcademyLogin(
      body.user_id,
      body.category
    );

    body.send_to = clubOrAcademy.user_id;

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

    let player = await this.findPlayerLogin(body.user_id);

    await this.checkPlayerCanAcceptContract(player.username);
    await this.checkDuplicateContract(
      body.player_email,
      body.club_academy_email,
      contractId
    );
    await this.checkConnectionExists(authUser.user_id, player.user_id);

    body.send_to = player.user_id;

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
   * @param {string} player_email
   */
  async checkPlayerCanAcceptContract(player_email) {
    let exists = await this.contractInst.findOne({
      player_email: player_email,
      status: { $in: [ContractStatus.ACTIVE, ContractStatus.YET_TO_START] },
      is_deleted: false,
    });

    if (exists) {
      throw new errors.BadRequest("Player already have an active contract");
    }
  }

  async checkDuplicateContract(player_email, club_academy_email, ignore = false) {
    const $where = {
      player_email: player_email,
      club_academy_email: club_academy_email,
      status: ContractStatus.PENDING,
      is_deleted: false,
    };    

    if (ignore) {
      $where["id"] = { $ne: ignore };
    }
    await this.findOrFail($where);
  }
  async checkOtherDuplicateContract(player_email, other_email, ignore = false) {
    const $where = {
      player_email: player_email,
      other_email: other_email,
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

  async findClubAcademyLogin(userId, category) {
    return await this.findLoginByUser(userId, category);
  }

  async findLoginByUser(userId, category) {
    const $where = {
      user_id: userId,
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

  async findPlayerLogin(userId) {
    return await this.findLoginByUser(userId, Role.PLAYER);
  }

  checkExpiryDate(body) {
    if (moment(body.expiry_date).diff(body.effective_date, "years") > 5) {
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
      throw new errors.ValidationFailed(
        "Cannot update already approved contract."
      );
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
      let sentByUser = await this.loginUtilityInst.findOne(
        { user_id: data.sent_by },
        { member_type: 1 }
      );
      let sendToUser = await this.loginUtilityInst.findOne(
        { user_id: data.send_to },
        { member_type: 1 }
      );
      data.created_by = sentByUser ? sentByUser.member_type : "";
      data.send_to_category = sendToUser ? sendToUser.member_type : "";
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
      user.user_id !== data.sent_by &&
      user.user_id !== data.send_to
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
            localField: "club_academy_email",
            foreignField: "email",
            as: "clubAcademyDetail",
          },
        },
        {
          $lookup: {
            from: "player_details",
            localField: "player_email",
            foreignField: "email",
            as: "playerDetail",
          },
        },
        {
          $project: {
            id: 1,
            login_detail: 1,
            clubAcademyDetail: { $filter: { input: "$clubAcademyDetail", as: "element", cond: { $eq: [{ $ifNull: ["$$element.deleted_at", null] }, null] } } },
            playerDetail: { $filter: { input: "$playerDetail", as: "element", cond: { $eq: [{ $ifNull: ["$$element.deleted_at", null] }, null] } } },
            club_academy_name: 1,
            player_name: 1,
            effective_date: 1,
            expiry_date: 1,
            status: 1,
          },
        },
        {
          $unwind: {
            path: "$clubAcademyDetail",
            preserveNullAndEmptyArrays: true,
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
            name: {
              $cond: {
                if: { $eq: [requestedData.role, Role.PLAYER] },
                then: "$club_academy_name",
                else: "$player_name",
              },
            },
            clubAcademyUserId: "$clubAcademyDetail.user_id",
            avatar: {
              $cond: {
                if: { $eq: [requestedData.role, Role.PLAYER] },
                then: "$clubAcademyDetail.avatar_url",
                else: "$playerDetail.avatar_url",
              },
            },
            effective_date: 1,
            expiry_date: 1,
            status: 1,
            created_by: "$login_detail.member_type",
            canUpdateStatus: {
              $cond: {
                if: { $eq: [requestedData.user_id, "$send_to"] },
                then: true,
                else: false,
              },
            },
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
        responseData = new EmploymentContractListResponseMapper().map(
          data[0].data
        );
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
        { username: 1, member_type: 1, role:1 }
      );
      let player_name = "",
        playerUserId = "",
        playerType = "",
        documents = [],
        clubAcademyEmail = "",
        clubAcademyType = "",
        clubAcademyName = "";
      if (isSendToPlayer || sentByUser.member_type === MEMBER.PLAYER) {
        playerUserId = isSendToPlayer ? data.send_to : data.sent_by;
        let player = await this.playerUtilityInst.findOne(
          { user_id: playerUserId },
          { first_name: 1, last_name: 1, player_type: 1, documents: 1 }
        );
        player_name = `${player.first_name} ${player.last_name}`;
        playerType = player.player_type;
        documents = player.documents;
      }

      const clubAcademyId = isSendToPlayer ? data.sent_by : data.send_to;
      const clubAcadDetails = await this.getClubDetails(clubAcademyId);
      clubAcademyName = clubAcadDetails.name;
      clubAcademyEmail = clubAcadDetails.email;
      clubAcademyType = clubAcadDetails.member_type;

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
          id: requestedData.id,
          playerUserId: playerUserId,
          documents: documents,
          status: reqObj.status,
        });

        if (requestedData.user.role == 'player') {
          await this.emailService.employmentContractApprovalByPlayer({
            email: sentByUser.username,
            name: clubAcademyName,
            from: player_name,
            category: sentByUser.role,
          });
          await this.sendAdminNotification("approved", {
            approver: {
              name: player_name,
              email: sentByUser.username,
              type:Role.PLAYER
            },
            approved: {
              name: clubAcademyName,
              email: clubAcademyEmail,
              type: clubAcademyType,
            },
          });
        } else {
          await this.emailService.employmentContractApprovalByClubAcademy({
            email: sentByUser.username,
            name: player_name,
            from: clubAcademyName,
            category: data.category,
          });
          await this.sendAdminNotification("approved", {
            approved: {
              name: player_name,
              email: sentByUser.username,
              type: Role.PLAYER,
            },
            approver: {
              name: clubAcademyName,
              email: clubAcademyEmail,
              type: clubAcademyType,
            },
          });
        }
      }
      if (reqObj.status === ContractStatus.DISAPPROVED) {
        await this.contractInst.updateOne(
          { id: requestedData.id },
          { status: ContractStatus.DISAPPROVED }
        );
        await this.updateProfileStatus({
          id: requestedData.id,
          playerUserId: playerUserId,
          documents: documents,
          status: reqObj.status,
        });

        if (requestedData.user.role == 'player') {
          await this.emailService.employmentContractDisapprovalByPlayer({
            email: sentByUser.username,
            name: clubAcademyName,
            reason: reqObj.remarks,
            from: player_name,
            category: sentByUser.role,
          });
          await this.sendAdminNotification("disapproved", {
            approver: {
              name: player_name,
              email: sentByUser.username,
              type: Role.PLAYER,
            },
            approved: {
              name: clubAcademyName,
              email: clubAcademyEmail,
              type: clubAcademyType,
            },
            reason: reqObj.remarks,
          });
        } else {
          await this.emailService.employmentContractDisapprovalByClubAcademy({
            email: sentByUser.username,
            name: player_name,
            reason: reqObj.remarks,
            from: clubAcademyName,
            category: data.category,
          });
          await this.sendAdminNotification("disapproved", {
            approved: {
              name: player_name,
              email: sentByUser.username,
              type: Role.PLAYER,
            },
            approver: {
              name: clubAcademyName,
              email: clubAcademyEmail,
              type: clubAcademyType,
            },
            reason: reqObj.remarks,
          });
        }
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
    let effective_date = moment(data.effective_date).format("YYYY-MM-DD");
    let expiry_date = moment(data.expiry_date).format("YYYY-MM-DD");
    if (dateNow < effective_date) {
      return ContractStatus.YET_TO_START;
    }
    if (expiry_date > dateNow) {
      return ContractStatus.ACTIVE;
    }
    if (expiry_date <= dateNow) {
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
        let condition = {
          id: { $ne: requestedData.id },
          is_deleted: false,
          status: {
            $in: [
              ContractStatus.ACTIVE,
              ContractStatus.COMPLETED,
              ContractStatus.YET_TO_START,
            ],
          },
          $or: [
            { sent_by: requestedData.playerUserId },
            { send_to: requestedData.playerUserId },
          ],
        };
        let playerContract = await this.contractInst.findOne(condition);
        profileStatus = playerContract
          ? ProfileStatus.VERIFIED
          : ProfileStatus.NON_VERIFIED;
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

  async sendAdminNotification (status, data) {
    try {
      const notificationTypes = {
        approved: this.emailService.employmentContractApprovalAdmin,
        disapproved: this.emailService.employmentContractDisapprovalAdmin,
      };
      if (notificationTypes[status]) {
        let admins = await this.adminUtilityInst.find({}, {email:1});
        await map(admins, (admin) => {
          data.email = admin.email;
          return notificationTypes[status].call(this.emailService, data);
        });
      }
    } catch (error) {
      console.log("Error in sending", status, "notification to admin", error);
    }
  }
}

module.exports = EmploymentContractService;
