const GoogleMailer = require('./GoogleMailer');
const AWSMailer    = require('./AWSMailer');
const SMTPMailer   = require('./SMTPMailer');

module.exports     = new SMTPMailer();
