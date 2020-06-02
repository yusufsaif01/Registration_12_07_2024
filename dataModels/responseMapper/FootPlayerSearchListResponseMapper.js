
class FootPlayerSearchListResponseMapper {
    map(players) {
        let response = [];
        if (players.length) {
            players.forEach((player) => {
                let data = {
                    "user_id": player.user_id,
                    "avatar": player.avatar_url || "-",
                    "name": (player.first_name || "") + " " + (player.last_name || ""),
                    "player_type": player.player_type || "-",
                    "position": "-"
                };
                data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";

                if (player.position && player.position.length > 0 && player.position[0] && player.position[0].name) {
                    data.position = player.position[0].name;
                }
                if (player.club_name) {
                    data.club_name = player.club_name;
                }
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = FootPlayerSearchListResponseMapper;