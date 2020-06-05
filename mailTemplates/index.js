const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const welcome = require("./welcomeMailTemplate");
const changePassword = require("./changePasswordMailTemplate");
const footplayerRequest = require("./footplayerRequestMailTemplate");

module.exports = {
    forgotPassword,
    emailVerification,
    welcome,
    changePassword,
    footplayerRequest
}
