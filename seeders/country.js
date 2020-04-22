const db = require('../db');
const LocationService = require('../services/LocationService');

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

