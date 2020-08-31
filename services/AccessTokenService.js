const moment = require("moment");
const AccessWhitelistUtility = require("../db/utilities/AccessWhitelistUtility");
const errors = require("../errors");
const ResponseMessage = require("../constants/ResponseMessage");
const EmailService = require("./EmailService");

module.exports = class AccessWhitelistService {
  constructor() {
    this.accessWhiteListInst = new AccessWhitelistUtility();
    this.emailServiceInst = new EmailService();
  }

  async requestOtp(email) {
    try {
      const $where = { email: email, is_deleted: false };
      const found = await this.accessWhiteListInst.findOne($where);

      if (!found) {
        throw new errors.NotFound();
      }

      const update = {
        otp: this.generateOtp(),
        otp_expiry: moment().add(10, "minutes"),
      };

      const updatedRes = await this.accessWhiteListInst.updateOne(
        $where,
        update
      );

      if (updatedRes.nModified) {
        await this.sendOtpEmail({ email, ...update });
      }

      return Promise.resolve();
    } catch (error) {
      console.log("Error in requesting OTP", error);
      return Promise.reject(error);
    }
  }

  async verifyOtp ({email, otp}) {
    const $where = {email, otp, is_deleted: false};

    const found = await this.accessWhiteListInst.findOne($where);

    if (!found) {
      throw new errors.NotFound();
    }

    const isExpired = new Date() > new Date(found.otp_expiry);

    if (isExpired) {
      throw new errors.BadRequest(ResponseMessage.OTP_EXPIRED);
    }

    return Promise.resolve({
      access_token: 'random-access-token'
    });

  }

  generateOtp(length = 6) {
    const dictionary = "0123456789";
    return new Array(length)
      .fill(0)
      .map(() => dictionary[Math.floor(Math.random() * dictionary.length)])
      .join("");
  }

  async sendOtpEmail(data) {
    this.emailServiceInst.sendOtpEmail(data);
  }
};
