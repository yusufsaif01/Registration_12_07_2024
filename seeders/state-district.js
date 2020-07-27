const db = require('../db');
const CountryUtility = require('../db/utilities/CountryUtility');
const StateUtility = require('../db/utilities/StateUtility');
const DistrictUtility = require('../db/utilities/DistrictUtility');
const masterData = require('../master-data');
const uuidv4 = require("uuid/v4");
const path = require('path');
let baseDir = path.resolve(__dirname);
global.__basedir = baseDir.split('\seeders')[0];

var stateDistrictSeeder = () => {
    (async () => {
        try {
            await db.connectDB();
            const countryUtilityInst = new CountryUtility();
            const stateUtilityInst = new StateUtility();
            const districtUtilityInst = new DistrictUtility();
            await masterData.getDataFromS3();
            let countryCode = 'IN';
            let countryDB = await countryUtilityInst.findOne({ sortname: countryCode });
            if (!countryDB) {
                throw new Error("didn't find country INDIA in Database, run country.js seeder first");
            }
            let country = masterData.getCountryByCountryCode(countryCode);
            let states = masterData.getStatesByCountryId(country.id);
            for (const state of states) {
                {
                    try {
                        let state_id = uuidv4();
                        await stateUtilityInst.insert({ id: state_id, name: state.name, country_id: countryDB.id });
                        console.log(`added state ${state.name}`);
                        let districts = masterData.getDistrictsByStateId(state.id);
                        for (const district of districts) {
                            try {
                                await districtUtilityInst.insert({ name: district.name, state_id: state_id });
                                console.log(`added district ${district.name} for state ${state.name}`);
                            }
                            catch (e) {
                                console.log("Error in district for-of loop", e);
                            }
                        }
                    }
                    catch (e) {
                        console.log("Error in state for-of loop", e);
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

stateDistrictSeeder();