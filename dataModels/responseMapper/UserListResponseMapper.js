
class UserListResponseMapper {
    map(users) {
        let response = [];
        users.player.forEach((user,index) => {
            let data = {
                "name": user.first_name +" "+ user.last_name,
                "position": user.position[0]?user.position[0].name:"",
                "type": user.player_type?user.player_type:"",
                "email": user.email,
                "status": users.loginDetails[index]? users.loginDetails[index].status:""
            };

            response.push(data);
        });
        return response;
    }
}

module.exports = UserListResponseMapper;