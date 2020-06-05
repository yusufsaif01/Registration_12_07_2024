class ClubFootPlayersResponseMapping {
  map(requests) {
    let response = [];
    if (requests.length) {
      requests.forEach((request) => {

        let userObj = request.send_to_user ? request.send_to_user : {}; 
        let name = [request.send_to.f_name, request.send_to.l_name].join(" ");

        if (userObj.user_id) {
          name = [userObj.first_name, userObj.last_name].join(" ")
        }

        let data = {
          id: request.id,
          user_id: request.send_to.user_id,
          avatar: userObj.avatar_url,
          category: userObj.player_type,
          name: name,
          position: '-',
          status: request.status,
        };

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
