const db = require('../db');
const bcrypt = require('bcrypt');
const prompts = require('prompts');
const config = require('../config').helper;
const path = require('path');
let baseDir = path.resolve(__dirname);
global.__basedir = baseDir.split('\seeders')[0];
const UserRegistrationService = require('../services/UserRegistrationService');

const onCancel = prompt => {
    console.log('Closing app without creating the admin.');
    process.exit();
}

var adminSeeder = () => {
    const questions = [
        {
            type: 'text', name: 'name', message: 'What is your NAME?'
        },
        {
            type: 'text', name: 'email', message: 'What is your E-MAIL?'
        },
        {
            type: 'password', name: 'password', message: 'What is your PASSWORD?'

        }
    ];

    (async () => {
        try {
            await db.connectDB();
            const response = await prompts(questions, { onCancel });
            const hash = await bcrypt.hash(response.password, config.salt_round);
            response.password = hash;

            const registrationInst = new UserRegistrationService();
            await registrationInst.adminRegistration(response);

            console.log("#############DONE##############");
            process.exit();
        } catch (err) {
            console.log("#############ERROR##############", err);
            process.exit(err);
        }
    })();
}

adminSeeder();

