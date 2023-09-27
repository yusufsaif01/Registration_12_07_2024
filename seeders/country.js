const db = require('../db');
const LocationService = require('../services/LocationService');
const path = require('path');
let baseDir = path.resolve(__dirname);
global.__basedir = baseDir.split('\seeders')[0];

var countrySeeder = () => {
    (async () => {
        try {
            await db.connectDB();
            const locationInst = new LocationService();
            await locationInst.addCountry({ name: "India", phone_code: "+91", sortname: "IN" })
            console.log("#############DONE##############");
            process.exit();
        } catch (err) {
            console.log("#############ERROR##############", err);
            process.exit(err);
        }
    })();
}

countrySeeder();

