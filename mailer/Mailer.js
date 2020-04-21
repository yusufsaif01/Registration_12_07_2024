const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const config = require('../config');


class Mailer {
    constructor({ serviceName, transportConf }) {
        this._serviceName = serviceName;
        this.from = config.mailer.fromEmail;
        this.mailer = this._createTransport(transportConf);
    }

    _createTransport(transportConf) {
        return nodemailer.createTransport(transportConf);
    }

    send({ to, subject, text, html }) {
        let from = this.from;
        return new Promise((resolve, reject) => {
            return this.mailer.sendMail({ from, to, subject, text, html }, (error, info) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                console.log("Mail sent");
                return resolve(info);
            });
        });
    }
}

module.exports = Mailer;

