const GoogleMailer = require('./GoogleMailer');
const AWSMailer = require('./AWSMailer');
const SMTPMailer = require('./SMTPMailer');

const config = require("../config").mailer;

let mailer = new SMTPMailer();

if (config) {
    if (config.provider === "AWS") {
        mailer = new AWSMailer();
    }

    if (config.provider === "GOOGLE") {
        mailer = new GoogleMailer();
    }

    if (config.provider === "MAIL_HOG") {
        mailer = new SMTPMailer();
    }
}

module.exports = mailer;
