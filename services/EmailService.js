const Promise = require("bluebird");
const mailer = require('../mailer');
const mailTemplates = require('../mailTemplates');

class EmailService {

    async forgotPassword(email, password_reset_link) {
        console.log('password reset link', password_reset_link)
        await this.sendMail("forgotPassword", { email: email, password_reset_link: password_reset_link });
    }

    async emailVerification(email, activation_link) {
        console.log('activation-link', activation_link, 'email', email)
        await this.sendMail("emailVerification", { email: email, activation_link: activation_link });
    }

    async welcome(email) {
        await this.sendMail("welcome", { email: email });
    }

    async sendMail(mailTemplate, data) {
        try {
            let { to, subject, html, text } = mailTemplates[mailTemplate](data);
            let details = await mailer.send({ to, subject, html, text });
            return details;
        } catch (err) {
            console.log("Error in sending mail", err);
            return Promise.resolve();
        }
    }
}

module.exports = EmailService;
