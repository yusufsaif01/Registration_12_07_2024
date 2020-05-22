class CommentsListResponseMapper {
    map(comments) {
        let response = [];
        if (comments.length) {
            comments.forEach((comment) => {
                let data = {
                    "comment": comment.comment,
                    "commented_by": "-",
                    "commented_at": comment.created_at
                };
                if (comment.player_detail) {
                    let commented_by = {
                        "avatar": comment.player_detail.avatar_url || "-",
                        "user_id": comment.player_detail.user_id,
                        "name": (comment.player_detail.first_name || "") + " " + (comment.player_detail.last_name || ""),
                        "type": comment.player_detail.player_type || "-",
                        "position": "-",
                    };
                    commented_by.name = String(commented_by.name).trim().length > 0 ? String(commented_by.name).trim() : "-";
                    if (comment.player_detail.position && comment.player_detail.position.length > 0 && comment.player_detail.position[0] && comment.player_detail.position[0].name) {
                        commented_by.position = comment.player_detail.position[0].name;
                    }
                    data.commented_by = commented_by;
                }
                else if (comment.club_academy_detail) {
                    let commented_by = {
                        "avatar": comment.club_academy_detail.avatar_url || "-",
                        "user_id": comment.club_academy_detail.user_id,
                        "name": comment.club_academy_detail.name,
                        "type": comment.club_academy_detail.member_type,
                    };
                    data.commented_by = commented_by;
                }
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = CommentsListResponseMapper;