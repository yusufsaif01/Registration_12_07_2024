const Promise = require("bluebird");
const BaseService = require("./BaseService");
const mailer = require('../mailer');
const mailTemplates = require('../mailTemplates');
const config = require('../config');


class NotificationService {

    forgotPassword(user,  password ) {
        console.log('password',password)
        return this.sendMail("forgotPassword", { email: user.email, password });
    }
    emailVerification(user,  activation_link ) {
        console.log('acitivation-link',activation_link,'email',user.email)
        return this.sendMail("emailVerification", { email: user.email, activation_link:activation_link });
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
