const PlayerUtility = require("../db/utilities/PlayerUtility");
const errors = require("../errors");
const ResponseMessage = require("../constants/ResponseMessage");
const PlayerType = require("../constants/PlayerType");
const ProfileStatus = require("../constants/ProfileStatus");
const DocumentStatus = require("../constants/DocumentStatus");
const LoginUtility = require("../db/utilities/LoginUtility");
const EmailService = require("./EmailService");

class PlayerDocumentsService {
  constructor() {
    this.playerDetailsInst = new PlayerUtility();
    this.loginDetailsInst = new LoginUtility();
    this.emailService = new EmailService();
  }

  async getUserDocuments(user_id) {
    let user = await this.getUser(user_id);

    return user;
  }

  async getUser(user_id) {
    let user = await this.playerDetailsInst.findOne({
      user_id: user_id,
      player_type: { $in: [PlayerType.AMATEUR, PlayerType.GRASSROOT] },
    });
    if (!user) {
      throw new errors.NotFound(ResponseMessage.USER_NOT_FOUND);
    }
    return user;
  }

  async updateDocumentStatus(user_id, status, remarks) {
    let user = await this.getUser(user_id);

    if (status == DocumentStatus.APPROVED) {
      await this.approvalHandler(user);
      return Promise.resolve();
    }
    if (status == DocumentStatus.DISAPPROVED) {
      await this.disapproveHandler(user, remarks);
      return Promise.resolve();
    }

  }

  async approvalHandler(user) {
    const $where = {
      user_id: user.user_id,
    };
    await this.playerDetailsInst.updateOne($where, {
      $set: {
        "documents.$[].status": DocumentStatus.APPROVED,
      },
    });

    await this.loginDetailsInst.updateOne($where, {
      $set: {
        profile_status: {
          status: ProfileStatus.VERIFIED,
        },
      },
    });

    await this.emailService.profileVerified(user.email);
  }

  async disapproveHandler(user, remarks) {
    const $where = {
      user_id: user.user_id,
    };
    await this.playerDetailsInst.updateOne($where, {
      $set: {
        "documents.$[].status": DocumentStatus.DISAPPROVED,
      },
    });

    await this.loginDetailsInst.updateOne($where, {
      $set: {
        profile_status: {
          status: ProfileStatus.DISAPPROVED,
          remarks, 
        },
      },
    });

    await this.emailService.profileDisapproved(user.email, remarks);
  }
}

module.exports = PlayerDocumentsService;
