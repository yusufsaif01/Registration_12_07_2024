const MEMBER = require('../../constants/MemberType')
class MemberListResponseMapper {
    map(users, member_type) {
        let response = [];
        if (users.length) {
            users.forEach((user) => {
                if (member_type === MEMBER.PLAYER) {
                    let data = {
                        "member_type": member_type,
                        "player_type": user.player_type || "-",
                        "name": (user.first_name || "") + " " + (user.last_name || ""),
                        "position": "-",
                        "avatar": user.avatar_url || "-",
                        "id": user.id
                    };
                    data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";

                    if (user.position && user.position.length > 0 && user.position[0] && user.position[0].name) {
                        data.position = user.position[0].name;
                    }
                    response.push(data);
                }
                else {
                    let data = {
                        "member_type": user.member_type,
                        "name": user.name,
                        "avatar": user.avatar_url || "-",
                        "id": user.id
                    };
                    response.push(data);
                }
            });
        }
        return response;
    }
}

module.exports = MemberListResponseMapper;