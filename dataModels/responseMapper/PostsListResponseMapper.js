class PostsListResponseMapper {
    map(posts) {
        let response = [];
        if (posts.length) {
            posts.forEach((p) => {
                if (p.post) {
                    let data = {
                        "id": p.post.id,
                        "post": "-",
                        "posted_by": "-",
                        "is_liked": false,
                        "likes": p.likes,
                        "comments": p.comments,
                        "created_at": p.post.created_at
                    };
                    if (p.likedByMe && p.likedByMe.length) {
                        data.is_liked = true;
                    }
                    if (p.post.media) {
                        data.post = {
                            text: p.post.media.text ? p.post.media.text : "",
                            media_url: p.post.media.media_url ? p.post.media.media_url : "",
                            media_type: p.post.media.media_type ? p.post.media.media_type : ""
                        }
                    }
                    if (p.player_detail) {
                        let posted_by = {
                            "avatar": p.player_detail.avatar_url || "-",
                            "user_id": p.player_detail.user_id,
                            "name": (p.player_detail.first_name || "") + " " + (p.player_detail.last_name || ""),
                            "type": p.player_detail.player_type || "-",
                            "position": "-",
                        };
                        posted_by.name = String(posted_by.name).trim().length > 0 ? String(posted_by.name).trim() : "-";
                        if (p.player_detail.position && p.player_detail.position.length > 0 && p.player_detail.position[0] && p.player_detail.position[0].name) {
                            posted_by.position = p.player_detail.position[0].name;
                        }
                        data.posted_by = posted_by;
                    }
                    if (p.club_academy_detail) {
                        let posted_by = {
                            "avatar": p.club_academy_detail.avatar_url || "-",
                            "user_id": p.club_academy_detail.user_id,
                            "name": p.club_academy_detail.name,
                            "type": p.club_academy_detail.member_type,
                        };
                        data.posted_by = posted_by;
                    }
                    response.push(data);
                }
            });
        }
        return response;
    }
}

module.exports = PostsListResponseMapper;