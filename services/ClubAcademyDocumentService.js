const errors = require("../errors");
const ResponseMessage = require("../constants/ResponseMessage");
const PlayerType = require("../constants/PlayerType");
const ProfileStatus = require("../constants/ProfileStatus");
const DocumentStatus = require("../constants/DocumentStatus");
const LoginUtility = require("../db/utilities/LoginUtility");
const EmailService = require("./EmailService");
const MemberType = require("../constants/MemberType");
const ClubAcademyUtility = require("../db/utilities/ClubAcademyUtility");

class ClubAcademyDocumentService {
  constructor() {
    this.clubAcademyInst = new ClubAcademyUtility();
    this.loginDetailsInst = new LoginUtility();
    this.emailService = new EmailService();
  }

  async getUserDocuments(user_id) {
    let user = await this.getUser(user_id);

    return user;
  }

  async getUser(user_id) {
    let user = await this.clubAcademyInst.findOne({
      user_id: user_id,
      member_type: { $in: [MemberType.CLUB, MemberType.ACADEMY] },
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
    let res = await this.clubAcademyInst.updateOne($where, {
      $set: {
        "documents.$.status": DocumentStatus.APPROVED,
        "documents.$.remark": '',
      },
    });

    if (res.nModified) {
      this.emailService.documentApproval({
        email: user.email,
        documentType: type,
        name: user.name,
      });
    }

    // reload model
    user = await this.getUser(user.user_id);

    // complete approval
    if (user.documents.every((doc) => doc.status == DocumentStatus.APPROVED)) {
      await this.loginDetailsInst.updateOne({
        user_id: user.user_id
      }, {
        $set: {
          profile_status: {
            status: ProfileStatus.VERIFIED,
          },
        },
      });
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
    let res = await this.clubAcademyInst.updateOne($where, {
      $set: {
        "documents.$.status": DocumentStatus.DISAPPROVED,
        "documents.$.remark": remarks,
      },
    });

    if (res.nModified) {
      
      // email notification
      this.emailService.documentDisApproval({
        email: user.email,
        documentType: type,
        name: user.name,
        reason: remarks
      });

      let updated = await this.loginDetailsInst.updateOne(
        {
          user_id: user.user_id,
          "profile_status.status": ProfileStatus.VERIFIED,
        },
        {
          $set: {
            profile_status: {
              status: ProfileStatus.DISAPPROVED,
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

module.exports = ClubAcademyDocumentService;
