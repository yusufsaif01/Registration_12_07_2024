const config = require('../config');
const Mailer = require("./Mailer");

class GoogleMailer extends Mailer {

    constructor() {
        let serviceName = 'Gmail',
        transportConf = {
            service: serviceName,
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

module.exports = GoogleMailer;
