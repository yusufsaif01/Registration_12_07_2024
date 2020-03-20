const AWS_SDK    = require('aws-sdk');

const Mailer = require("./Mailer");
const config = require('../config');

class AWSMailer extends Mailer {

    constructor() {
        let serviceName = 'AWS_SES',
        transportConf = new AWS_SDK.SES({
            accessKeyId: config.mailer.accessKey,
            secretAccessKey: config.mailer.accessKeySecret,
            region: config.mailer.sesRegion,
        });
        super({
            serviceName,
            transportConf
        });
    }
}

module.exports = AWSMailer;
