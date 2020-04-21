const db = require('../db');
const CountryService = require('../services/CountryService');

var countrySeeder = () => {
    (async () => {
        try {
            await db.connectDB();
            const countryInst = new CountryService();
            await countryInst.addCountry('India')
            console.log("#############DONE##############");
            process.exit();
        } catch (err) {
            console.log("#############ERROR##############", err);
            process.exit(err);
        }
    })();
}

countrySeeder();

