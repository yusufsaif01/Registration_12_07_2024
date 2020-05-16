const MEMBER = require('../../constants/MemberType')
class MemberListResponseMapper {
    map(users) {
        let response = [];
        if (users.length) {
            users.forEach((user) => {
                if (user.player_detail) {
                    let data = {
                        "member_type": MEMBER.PLAYER,
                        "player_type": user.player_detail.player_type || "-",
                        "name": (user.player_detail.first_name || "") + " " + (user.player_detail.last_name || ""),
                        "position": "-",
                        "avatar": user.player_detail.avatar_url || "-",
                        "user_id": user.player_detail.user_id
                    };
                    data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";

                    if (user.player_detail.position && user.player_detail.position.length > 0 && user.player_detail.position[0] && user.player_detail.position[0].name) {
                        data.position = user.player_detail.position[0].name;
                    }
                    response.push(data);
                }
                else {
                    let data = {
                        "member_type": user.club_academy_detail.member_type,
                        "name": user.club_academy_detail.name,
                        "avatar": user.club_academy_detail.avatar_url || "-",
                        "user_id": user.club_academy_detail.user_id
                    };
                    response.push(data);
                }
            });
        }
        return response;
    }
}

module.exports = MemberListResponseMapper;