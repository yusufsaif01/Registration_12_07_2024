const ActivityUtility = require("../db/utilities/ActivityUtility");

class ActivityService {

	async  loginActivity(emp_id , type) {
		try {

			const _activityInst = new ActivityUtility();
			let activity = await _activityInst.insertMany([{
				emp_id: emp_id,
				activity_type: type,
				activity_time: new Date()
			}]);

			return activity;
			// next();

		} catch (err) {
			return err;
		}
	}

}

module.exports = new ActivityService();

