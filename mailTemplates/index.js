const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const welcome = require("./welcomeMailTemplate");
const changePassword = require("./changePasswordMailTemplate");

const postEmailConfirmation = require("./postEmailConfirmation");
const sendOtpEmail = require("./sendOtpEmailTemplate");

module.exports = {
  forgotPassword,
  emailVerification,
  welcome,
  postEmailConfirmation,
  changePassword,
  sendOtpEmail,
};
