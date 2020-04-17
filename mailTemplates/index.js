const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const welcome = require("./welcomeMailTemplate");
const changePassword = require("./changePasswordMailTemplate");

module.exports = {
    forgotPassword,
    emailVerification,
    welcome,
    changePassword
}
