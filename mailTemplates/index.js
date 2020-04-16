const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const welcome = require("./welcomeMailTemplate");

module.exports = {
    forgotPassword,
    emailVerification,
    welcome
}
