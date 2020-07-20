const Promise = require("bluebird");
const mailer = require('../mailer');
const mailTemplates = require('../mailTemplates');
const render = require("../mailTemplates/render");

class EmailService {

    async forgotPassword(email, password_reset_link, name) {
        await this.sendMail("forgotPassword", { email: email, password_reset_link: password_reset_link, name });
    }

    async emailVerification(email, activation_link, name) {
        await this.sendMail("emailVerification", { email: email, activation_link: activation_link, name:name});
    }

    async welcome(email) {
        await this.sendMail("welcome", { email: email });
    }

    async changePassword(email, name) {
        await this.sendMail("changePassword", { email: email, name });
    }

    async footplayerRequest(send_to_email, sent_by = {}) {
        await this.sendMail("footplayerRequest", {
          send_to_email: send_to_email,
          sent_by_member_type: sent_by.member_type,
          sent_by_name: sent_by.name,
          player_name: sent_by.player_name,
        });
    }

    async sendFootplayerInvite(send_to_email, send_to_name, sent_by = {}, link) {
        await this.sendMail("footplayerInvite", { send_to_email: send_to_email, send_to_name, sent_by_member_type: sent_by.member_type, sent_by_name: sent_by.name, link: link });
    }

    async sendMail(mailTemplate, data) {
        try {
            let { to, subject, html, text } = mailTemplates[mailTemplate](data);
            if (html) {
                html = render(html, data);
            }
            let details = await mailer.send({ to, subject, html, text });
            return details;
        } catch (err) {
            console.log("Error in sending mail", err);
            return Promise.resolve();
        }
    }

    async profileVerified (email) {
        await this.sendMail("profileVerified", {email: email});
    }
    async profileDisapproved (email, remarks) {
        await this.sendMail("profileDisapproved", {email: email, remarks});
    }

    async documentApproval (data) {
        await this.sendMail("documentApproval", data)
    }

    async documentDisApproval (data) {
        await this.sendMail("documentDisapproval", data);
    }

    async employmentContractApproval (data) {
        await this.sendMail("employmentContractApproval", data)
    }
        
    async employmentContractDisapprovalByPlayer (data) {
        await this.sendMail("employmentContractDisapprovalByPlayer", data);
    }
    async employmentContractDisapprovalByClubAcademy (data) {
        await this.sendMail("employmentContractDisapprovalByClubAcademy", data);
    }
    async employmentContractApprovalByClubAcademy (data) {
        await this.sendMail("employmentContractApprovalByClubAcademy", data);
    }
    async employmentContractApprovalByPlayer (data) {
        await this.sendMail("employmentContractApprovalByPlayer", data);
    }

    async employmentContractCreatedClubAcademy(data) {
        await this.sendMail("employmentContractCreatedClubAcademy", data);
    }
    async employmentContractCreatedPlayer(data) {
        await this.sendMail("employmentContractCreatedPlayer", data);
    }

    async employmentContractApprovalAdmin(data) {
        await this.sendMail("employmentContractApprovalAdmin", data);
    }
    async employmentContractDisapprovalAdmin(data) {
        await this.sendMail("employmentContractDisapprovalAdmin", data);
    }

    async footPlayerInviteAccepted (data) {
        await this.sendMail("footPlayerInviteAccepted", data);
    }
    async postEmailConfirmation (data) {
        await this.sendMail("postEmailConfirmation", data);
    }
}

module.exports = EmailService;
