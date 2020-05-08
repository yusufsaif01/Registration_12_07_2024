
class FootmateRequestListResponseMapper {
    map(footmateRequests) {
        let response = [];
        if (footmateRequests.length) {
            footmateRequests.forEach((footmateRequest) => {
                let data = {
                    "name": (footmateRequest.player_details.first_name || "") + " " + (footmateRequest.player_details.last_name || ""),
                    "position": "-",
                    "player_type": footmateRequest.player_details.player_type || "-",
                    "avatar": footmateRequest.player_details.avatar_url || "-",
                    "user_id": footmateRequest.player_details.user_id,
                    "request_id": footmateRequest.request_id,
                    "mutuals": 0
                };
                data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";

                if (footmateRequest.player_details.position && footmateRequest.player_details.position.length > 0 && footmateRequest.player_details.position[0] && footmateRequest.player_details.position[0].name) {
                    data.position = footmateRequest.player_details.position[0].name;
                }
                if(footmateRequest.mutual && footmateRequest.mutual.length)
                {
                    data.mutuals = footmateRequest.mutual.length;
                }
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = FootmateRequestListResponseMapper;