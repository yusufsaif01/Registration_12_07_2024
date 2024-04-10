const PlayerUtility = require("../db/utilities/PlayerUtility");
const ClubAcademyUtility = require("../db/utilities/ClubAcademyUtility");

module.exports = class UtilityService {
  constructor() {
    this.playerUtilityInst = new PlayerUtility();
    this.clubAcademyUtilityInst = new ClubAcademyUtility();
  }

  async getClubDetails(userID, projection = {}) {
    return await this.clubAcademyUtilityInst.findOne(
      {
        user_id: userID,
      },
      projection
    );
  }
  async getPlayerDetails(userID, projection = {}) {
    console.log("inside getplayerdetails====");

    console.log(userID);
    return await this.playerUtilityInst.findOnePlayer(
      {
        user_id: userID,
      },
      projection
    );
  }
};
