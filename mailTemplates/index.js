const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const welcome = require("./welcomeMailTemplate");
const changePassword = require("./changePasswordMailTemplate");
const profileVerified = require("./profileVerifiedTemplate");
const profileDisapproved = require("./profileDisapprovedTemplate");
const documentApproval = require("./documentApprovalTemplate");
const documentDisapproval = require("./documentDisApprovalTemplate");

module.exports = {
  forgotPassword,
  emailVerification,
  welcome,
  changePassword,
  profileVerified,
  profileDisapproved,
  documentApproval,
  documentDisapproval,
};
