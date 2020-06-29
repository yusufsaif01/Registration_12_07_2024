const FOOTPLAYER_STATUS = require('../../constants/FootPlayerStatus');
class ClubFootPlayersResponseMapping {
  map(requests, footplayers) {
    let response = [];
    if (requests.length) {
      requests.forEach((request) => {

        let userObj = request.send_to_user ? request.send_to_user : {};

        let data = {
          user_id: request.send_to.user_id,
          avatar: userObj.avatar_url,
          category: userObj.player_type,
          name: request.send_to.name || "",
          position: '-',
        };

        if (footplayers === 0) {
          data.id = request.id;
          data.canAddContract = false,
          data.email = request.send_to.email;
          data.status = request.status;
        }
        if(request.status && request.status === FOOTPLAYER_STATUS.ADDED && footplayers === 0) 
        {
          data.canAddContract = request.canAddContract
        }

        if (
          userObj.position &&
          userObj.position.length > 0 &&
          userObj.position[0] &&
          userObj.position[0].name
        ) {
          data.position = userObj.position[0].name;
        }
        response.push(data);
      });
    }
    return response;
  }
}

module.exports = ClubFootPlayersResponseMapping;
