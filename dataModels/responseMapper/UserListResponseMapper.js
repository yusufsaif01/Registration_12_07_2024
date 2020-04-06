
class UserListResponseMapper {
    map(users, member_type) {
        let response = [];
        if (member_type === 'player') {
            users.player.forEach((user, index) => {
                let data = {
                    "name": user.first_name + " " + user.last_name,
                    "position": user.position[0] ? user.position[0].name : "",
                    "type": user.player_type ? user.player_type : "",
                    "email": user.email,
                    "status": users.loginDetails[index] ? users.loginDetails[index] : ""
                };

                response.push(data);
            });
        }
        else
        {
            users.clubAcademy.forEach((user, index) => {
                let data = {
                    "name": user.name,
                    "no_of_players": user.associated_players ? user.associated_players : "",
                    "email": user.email,
                    "status": users.loginDetails[index] ? users.loginDetails[index] : ""
                };

                response.push(data);
            });
        }
        return response;
    }
}

module.exports = UserListResponseMapper;