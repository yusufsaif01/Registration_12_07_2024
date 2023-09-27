const ActivitySchema = require("../schemas/ActivitySchema");
const BaseUtility = require("./BaseUtility");

class ActivityUtility extends BaseUtility {
	constructor() {
		super(ActivitySchema);
	}	
}

module.exports = ActivityUtility;