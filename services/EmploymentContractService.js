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
    body.status = ContractStatus.PENDING;

    if (body.clubAcademyName == "others") {
      // remove keys that are not required.
    }

    if (authUser.role == "player") {
      resp = await this.playerCreatingContract(body, authUser);
    }

    return Promise.resolve(resp);
  }

  async playerCreatingContract(body, authUser) {
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

  async findClubAcademyByEmail(email, category) {
    const $where = {
      username: email,
      role: category,
      is_deleted: false,
      "profile_status.status": ProfileStatus.VERIFIED,
    };
    let user = await this.loginUtilityInst.findOne($where);

    if (!user) {
      throw new Error("Club or Academy does not exists");
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
}

module.exports = EmploymentContractService;
