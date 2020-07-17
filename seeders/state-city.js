const db = require('../db');
const CountryUtility = require('../db/utilities/CountryUtility');
const StateUtility = require('../db/utilities/StateUtility');
const CityUtility = require('../db/utilities/CityUtility');
const masterData = require('../master-data');
const uuidv4 = require("uuid/v4");
const path = require('path');
let baseDir = path.resolve(__dirname);
global.__basedir = baseDir.split('\seeders')[0];

var stateCitySeeder = () => {
    (async () => {
        try {
            await db.connectDB();
            const countryUtilityInst = new CountryUtility();
            const stateUtilityInst = new StateUtility();
            const cityUtilityInst = new CityUtility();
            await masterData.getDataFromS3();
            let countryCode = 'IN';
            let countryDB = await countryUtilityInst.findOne({ sortname: countryCode });
            let country = masterData.getCountryByCountryCode(countryCode);
            let states = masterData.getStatesByCountryId(country.id);
            for (const state of states) {
                {
                    let state_id = uuidv4();
                    await stateUtilityInst.insert({ id: state_id, name: state.name, country_id: countryDB.id });
                    console.log(`added state ${state.name}`);
                    let cities = masterData.getCitiesByStateId(state.id);
                    for (const city of cities) {
                        await cityUtilityInst.insert({ name: city.name, state_id: state_id });
                        console.log(`added city ${city.name} for state ${state.name}`);
                    }
                }
            }
            console.log("#############DONE##############");
            process.exit();
        } catch (err) {
            console.log("#############ERROR##############", err);
            process.exit(err);
        }
    })();
}

stateCitySeeder();