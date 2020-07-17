const PlayerUtility = require('../db/utilities/PlayerUtility');
const PLAYER_TYPE = require("../constants/PlayerType");
const moment = require('moment');

var updatePlayerType = () => {
    (async () => {
        try {
            let playerUtilityInst = new PlayerUtility();
            let condition = { player_type: { $in: [PLAYER_TYPE.AMATEUR, PLAYER_TYPE.GRASSROOT] } };
            let players = await playerUtilityInst.find(condition, { user_id: 1, dob: 1, player_type: 1 });
            let now = moment();
            for (const player of players) {
                if (player.dob) {
                    let dob = moment(player.dob, 'YYYY-MM-DD');
                    let age = now.diff(dob, 'years', true)
                    let updatedPlayerType = age > 12 ? PLAYER_TYPE.AMATEUR : PLAYER_TYPE.GRASSROOT;
                    if (player.player_type !== updatedPlayerType)
                        await playerUtilityInst.updateOne({ user_id: player.user_id }, { player_type: updatedPlayerType });
                }
            }
            console.log("*****player-type-updated*****");
        } catch (err) {
            console.log("*****player-type-update-error*****", err);
        }
    })();
}

module.exports = updatePlayerType
