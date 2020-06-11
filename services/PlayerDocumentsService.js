const PlayerUtility = require("../db/utilities/PlayerUtility");
const errors = require("../errors");
const ResponseMessage = require("../constants/ResponseMessage");
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
    });
    if (!user) {
      throw new errors.NotFound(ResponseMessage.USER_NOT_FOUND);
    }
    return user;
  }

  async updateDocumentStatus(user_id, type, status, remarks) {
    let user = await this.getUser(user_id);

    if (status == DocumentStatus.APPROVED) {
      await this.approvalHandler(user, type);
      return Promise.resolve();
    }
    if (status == DocumentStatus.DISAPPROVED) {
      await this.disapproveHandler(user, type, remarks);
      return Promise.resolve();
    }
  }

  async approvalHandler(user, type) {
    const $where = {
      user_id: user.user_id,
      documents: {
        $elemMatch: {
          type: type,
        },
      },
    };
    let res = await this.playerDetailsInst.updateOne($where, {
      $set: {
        "documents.$.status": DocumentStatus.APPROVED,
        "documents.$.remark": "",
      },
    });

    if (res.nModified) {

      // document approval
      this.emailService.documentApproval({
        email: user.email,
        documentType: type,
        name: [user.first_name, user.last_name].join(" "),
      });

      // profile approval
      await this.loginDetailsInst.updateOne(
        {
          user_id: user.user_id,
        },
        {
          $set: {
            profile_status: {
              status: ProfileStatus.VERIFIED,
            },
          },
        }
      );

      // send profile approved notification
      await this.emailService.profileVerified(user.email);
    }
  }

  async disapproveHandler(user, type, remarks) {
    const $where = {
      user_id: user.user_id,
      documents: {
        $elemMatch: {
          type: type,
        },
      },
    };
    let res = await this.playerDetailsInst.updateOne($where, {
      $set: {
        "documents.$.status": DocumentStatus.DISAPPROVED,
        "documents.$.remark": remarks,
      },
    });
    if (res.nModified) {

      /**
       * Send email notification
       */
      this.emailService.documentDisApproval({
        email: user.email,
        documentType: type,
        name: [user.first_name, user.last_name].join(" "),
        reason: remarks,
      });

      /**
       * Update profile status
       * 1. find existing verified user
       * 2. change status
       * 
       * if the user is already disapproved, modified documents will be zero,
       * avoiding sending emails multiple times.
       */
      let updated = await this.loginDetailsInst.updateOne(
        {
          user_id: user.user_id,
          'profile_status.status': ProfileStatus.VERIFIED,
        },
        {
          $set: {
            profile_status: {
              status: ProfileStatus.NON_VERIFIED,
              remarks,
            },
          },
        }
      );

      if (updated.nModified) {
        // send email for profile disapproval.
        await this.emailService.profileDisapproved(user.email, remarks);
      }

    }
  }
}

module.exports = PlayerDocumentsService;
