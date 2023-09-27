
class FootmateListResponseMapper {
    map(footmates) {
        let response = [];
        if (footmates.length) {
            footmates.forEach((footmate) => {
                let data = {
                    "name": (footmate.player_details.first_name || "") + " " + (footmate.player_details.last_name || ""),
                    "position": "-",
                    "player_type": footmate.player_details.player_type || "-",
                    "avatar": footmate.player_details.avatar_url || "-",
                    "user_id": footmate.player_details.user_id,
                    "mutuals": footmate.mutual
                };
                data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";

                if (footmate.player_details.position && footmate.player_details.position.length > 0 && footmate.player_details.position[0] && footmate.player_details.position[0].name) {
                    data.position = footmate.player_details.position[0].name;
                }
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = FootmateListResponseMapper;