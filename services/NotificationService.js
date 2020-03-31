const Promise = require("bluebird");
const BaseService = require("./BaseService");
const mailer = require('../mailer');
const mailTemplates = require('../mailTemplates');
const config = require('../config');


class NotificationService {

    forgotPassword(user, { password }) {
        return this.sendMail("forgotPassword", { email: user.email, password });
    }

    async sendMail(mailTemplate, data) {
        try {
            let { to, subject, html, text } = mailTemplates[mailTemplate](data);
            let details = await mailer.send({ to, subject, html, text });
            return details;
        } catch (err) {
            console.log(err);
        }
        console.log("Error in sending mail")
        return Promise.resolve();
    }
}

module.exports = NotificationService;
