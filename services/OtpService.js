const Promise = require("bluebird");
const errors = require("../errors");
const LoginUtility = require("../db/utilities/LoginUtility");
const PlayerUtility = require("../db/utilities/PlayerUtility");
const coacheUtility = require("../db/utilities/CoacheUtility");
const ClubAcademyUtility = require("../db/utilities/ClubAcademyUtility");
const UserService = require("./UserService");
const uuid = require("uuid/v4");
const OtpUtility = require("../db/utilities/OtpUtility");
const EmailService = require("./EmailService");
const config = require("../config");
const _ = require("lodash");

class OtpService {
  constructor() {
    this.otpUtilityInst = new OtpUtility();
    this.emailService = new EmailService();
  }

  async otp_generate(email, account_active_url, name) {
    try {
      // Function to generate OTP

      let digits = "0123456789";
      let OTP = "";
      let len = digits.length;
      for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * len)];
      }
      const requetData = {
        email: email,
        otp: OTP,
        name: name,
      };
      const returnData = await this.otpUtilityInst.insertOtp(requetData);
      this.emailService.emailVerification(email, OTP);
    
      return OTP;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  async otpVerify(bodyObj) {
    try {
      console.log("bodyObj is ", bodyObj);
      const returnData = await this.otpUtilityInst.otpVerify(bodyObj);

      if (returnData) {
        return returnData;
      } else {
        return "otp not match";
      }
    } catch (error) {}
  }
}

module.exports = OtpService;
