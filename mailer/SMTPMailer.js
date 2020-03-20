const config = require('../config');
const Mailer = require("./Mailer");

class SMTPMailer extends Mailer {

    constructor() {
        let serviceName = 'SMTP',
        transportConf = {
            service: serviceName,
            host: config.mailer.host,
            port: config.mailer.port,
            secure: config.mailer.secure,
            auth: {
                user: config.mailer.email,
                pass: config.mailer.password
            }
        };

        super({
            serviceName,
            transportConf
        });
    }

}

module.exports = SMTPMailer;
