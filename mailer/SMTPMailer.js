const config = require('../config');
const Mailer = require("./Mailer");

class SMTPMailer extends Mailer {

    constructor() {
        let serviceName = 'SMTP',
            transportConf = {
                service: serviceName,
                host: config.mailer.host,
                port: config.mailer.port
            };

        if (config.mailer.secure) {
            transportConf.secure = config.mailer.secure;
            transportConf.auth = {};
            transportConf.auth.user = config.mailer.email;
            transportConf.auth.password = config.mailer.password;
        }

        super({
            serviceName,
            transportConf
        });
    }

}

module.exports = SMTPMailer;
