const forgotPassword = require("./forgotPasswordMailTemplate");
const emailVerification = require("./activationLinkMailTemplate");
const changePassword = require("./changePasswordMailTemplate");

module.exports = {
    forgotPassword,
    emailVerification,
    changePassword
}
