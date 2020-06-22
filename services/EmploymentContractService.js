const moment = require("moment");
const LoginUtility = require("../db/utilities/LoginUtility");
const MEMBER = require("../constants/MemberType");
const PROFILE_STATUS = require("../constants/ProfileStatus");
const CONTRACT_STATUS = require("../constants/ContractStatus");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const _ = require("lodash");
const PlayerUtility = require("../db/utilities/PlayerUtility");
const errors = require("../errors");
const EmailService = require("./EmailService");
const config = require("../config");
const Role = require("../constants/Role");
const ContractStatus = require("../constants/ContractStatus");
const ProfileStatus = require("../constants/ProfileStatus");
const EmploymentContractUtility = require("../db/utilities/EmploymentContractUtility");

class EmploymentContractService {
  constructor() {
    this.loginUtilityInst = new LoginUtility();
    this.playerUtilityInst = new PlayerUtility();
    this.emailService = new EmailService();
    this.contractInst = new EmploymentContractUtility();
  }

  async createContract(body, authUser) {
    let resp = {};

    this.preHandlingCheck(body);

    if (authUser.role == "player") {
      resp = await this.playerCreatingContract(body, authUser);
    }

    return Promise.resolve(resp);
  }
  async updateContract(contractId, body, authUser) {
    let resp = {};

    this.preHandlingCheck(body);

    if (authUser.role == "player") {
      resp = await this.playerUpdatingContract(contractId, body, authUser);
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

    await this.contractInst.insert(body);

    return Promise.resolve();
  }

  async playerUpdatingContract(contractId, body, authUser) {
    await this.userCanUpdateContract(authUser.user_id, contractId);

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

  /**
   * Accept contract only if there is no active contract
   * @param {string} playerEmail
   */
  async checkPlayerCanAcceptContract(playerEmail) {
    let exists = await this.contractInst.findOne({
      playerEmail: playerEmail,
      status: ContractStatus.ACTIVE,
      is_deleted: false,
    });

    if (exists) {
      throw new errors.BadRequest("Player already have an active contract");
    }
  }

  async checkDuplicateContract(playerEmail, clubAcademyEmail) {
    let exists = await this.contractInst.findOne({
      playerEmail: playerEmail,
      clubAcademyEmail: clubAcademyEmail,
      status: ContractStatus.PENDING,
      is_deleted: false,
    });

    if (exists) {
      throw new errors.BadRequest("Contract already exists");
    }
  }

  async findClubAcademyByEmail(email, category) {
    const $where = {
      username: email,
      role: category,
      is_deleted: false,
      "profile_status.status": ProfileStatus.VERIFIED,
    };
    let user = await this.loginUtilityInst.findOne($where);

    if (!user) {
      throw new errors.BadRequest("Club or Academy does not exists");
    }

    return user;
  }

  async findPlayerByEmail(email) {
    let user = await this.loginUtilityInst.findOne({
      username: email,
      role: { $in: [Role.PLAYER] },
      is_deleted: false,
    });

    if (!user) {
      throw new Error("User does not exists");
    }
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
}

module.exports = EmploymentContractService;
