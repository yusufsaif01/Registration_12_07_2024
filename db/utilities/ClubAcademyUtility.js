const ClubAcademySchema = require("../schemas/ClubAcademySchema");
const BaseUtility = require("./BaseUtility");

class ClubAcademyUtility extends BaseUtility {
	constructor() {
		super(ClubAcademySchema);
	}	
}

module.exports = ClubAcademyUtility;