const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const welcome = require("./welcomeMailTemplate");
const changePassword = require("./changePasswordMailTemplate");
const profileVerified = require("./profileVerifiedTemplate");
const profileDisapproved = require("./profileDisapprovedTemplate");

module.exports = {
  forgotPassword,
  emailVerification,
  welcome,
  changePassword,
  profileVerified,
  profileDisapproved,
};
