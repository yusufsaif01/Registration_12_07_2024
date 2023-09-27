const AWS_SDK = require('aws-sdk');

const Mailer = require("./Mailer");
const config = require('../config');

class AWSMailer extends Mailer {

    constructor() {
        let serviceName = 'AWS_SES',
            transportConf = {
                "SES": new AWS_SDK.SES({
                    accessKeyId: config.mailer.accessKey,
                    secretAccessKey: config.mailer.accessKeySecret,
                    region: config.mailer.region,
                })
            };
        super({
            serviceName,
            transportConf
        });
    }
}

module.exports = AWSMailer;
