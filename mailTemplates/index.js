const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const welcome = require("./welcomeMailTemplate");
const changePassword = require("./changePasswordMailTemplate");
const profileVerified = require("./profileVerifiedTemplate");
const profileDisapproved = require("./profileDisapprovedTemplate");
const documentApproval = require("./documentApprovalTemplate");
const documentDisapproval = require("./documentDisApprovalTemplate");
const footplayerRequest = require("./footplayerRequestMailTemplate");
const footplayerInvite = require("./footplayerInviteMailTemplate");
const employmentContractApproval = require("./EmploymentContractApprovalTemplate");
const employmentContractDisapproval = require("./EmploymentContractDisapprovalTemplate");
const employmentContractCreatedClubAcademy = require("./employmentContractCreatedClubAcademy");
const employmentContractCreatedPlayer = require("./employmentContractCreatedPlayer");
const SampleHtmlTemplate = require("./SampleHtmlTemplate");

module.exports = {
  forgotPassword,
  emailVerification,
  welcome,
  changePassword,
  profileVerified,
  profileDisapproved,
  documentApproval,
  documentDisapproval,
  footplayerRequest,
  footplayerInvite,
  employmentContractApproval,
  employmentContractDisapproval,
  employmentContractCreatedClubAcademy,
  employmentContractCreatedPlayer,
  SampleHtmlTemplate,
};
