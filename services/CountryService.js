const BaseService = require("./BaseService");
const CountryUtility = require("../db/utilities/CountryUtility");

class CountryService extends BaseService {

	constructor(){
		super();
		this.countryUtilityInst = new CountryUtility();
	}
    addIndia(){
        try {

			const _activityInst = new ActivityUtility();
			let activity = await _activityInst.insertMany([{
				user_id: user_id,
				type: type,
				activity: new Date()
			}]);

			return activity;
		} catch (err) {
			return err;
		}
    }
}

module.exports = CountryService;