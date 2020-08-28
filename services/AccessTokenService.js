const moment = require("moment");
const AccessWhitelistUtility = require("../db/utilities/AccessWhitelistUtility");
const errors = require("../errors");
const ResponseMessage = require("../constants/ResponseMessage");

module.exports = class AccessWhitelistService {
  constructor() {
    this.accessWhiteListInst = new AccessWhitelistUtility();
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
        expiry: moment().add(1, "hour"),
      };

      const updatedRes = await this.accessWhiteListInst.updateOne(
        $where,
        update
      );

      if (updatedRes.nModified) {
        await this.setOtpEmail(update);
      }

      return Promise.resolve();
    } catch (error) {
      console.log("Error in requesting OTP", error);
      return Promise.reject(error);
    }
  }

  generateOtp(length = 6) {
    const dictionary = "0123456789";
    return new Array(length)
      .fill(0)
      .map(() => dictionary[Math.floor(Math.random() * dictionary.length)])
      .join("");
  }

  async setOtpEmail(data) {}
};
