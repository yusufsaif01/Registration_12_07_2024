
class FootPlayerSearchListResponseMapper {
    map(members) {
        let response = [];
        if (members.length) {
            members.forEach((member) => {
                if (member.player_detail) {
                    let data = {
                        "user_id": member.player_detail.user_id,
                        "avatar": member.player_detail.avatar_url || "-",
                        "email": member.player_detail.email,
                        "name": (member.player_detail.first_name || "") + " " + (member.player_detail.last_name || ""),
                        "member_type": member.player_detail.member_type,
                        "category": member.player_detail.player_type || "-",
                        "position": "-",
                        "is_verified": member.player_detail.is_verified || false,
                        "status": member.player_detail.status || null
                    };
                    data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";

                    if (member.player_detail.position && member.player_detail.position.length > 0 && member.player_detail.position[0] && member.player_detail.position[0].name) {
                        data.position = member.player_detail.position[0].name;
                    }
                    if (member.player_detail.club_name) {
                        data.club_name = member.player_detail.club_name;
                    }
                    response.push(data);
                }
                if (member.club_academy_detail) {
                    let data = {
                        "user_id": member.club_academy_detail.user_id,
                        "avatar": member.club_academy_detail.avatar_url || "-",
                        "email": member.club_academy_detail.email,
                        "name": member.club_academy_detail.name,
                        "member_type": member.club_academy_detail.member_type,
                        "category": member.club_academy_detail.type || "-",
                        "position": "",
                        "is_verified": member.club_academy_detail.is_verified || false
                    };
                    response.push(data);
                }
            });
        }
        return response;
    }
}

module.exports = FootPlayerSearchListResponseMapper;