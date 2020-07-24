const _ = require("lodash");
const MEMBER = require('../../constants/MemberType')

class PostsListResponseMapper {
    map(posts, commentFlag) {
        let response = [];
        if (posts.length) {
            for (const p of posts) {
                if (p.post) {
                    let data = {
                        "id": p.post.id,
                        "post": "-",
                        "posted_by": "-",
                        "is_liked": false,
                        "likes": p.likes,
                        "comments": "-",
                        "created_at": p.post.created_at
                    };
                    if (p.likedByMe && p.likedByMe.length) {
                        data.is_liked = true;
                    }
                    if (p.comments) {
                        let comments = {};
                        comments.total = p.comments.total || 0;
                        if (commentFlag === 1) {
                            if (p.comments.data && p.comments.data.length) {
                                let commentDataArrayDB = p.comments.data;
                                let commentDataArrayResponse = [];
                                for (const commentData of commentDataArrayDB) {
                                    let comment_data = {
                                        "comment": commentData.comment,
                                        "commented_by": "-",
                                        "commented_at": commentData.created_at
                                    };
                                    if (commentData.player_detail && !_.isEmpty(commentData.player_detail)) {
                                        let commented_by = {
                                            "avatar": commentData.player_detail.avatar_url || "-",
                                            "user_id": commentData.player_detail.user_id,
                                            "name": (commentData.player_detail.first_name || "") + " " + (commentData.player_detail.last_name || ""),
                                            "type": commentData.player_detail.player_type || "-",
                                            "member_type": MEMBER.PLAYER,
                                            "position": "-",
                                        };
                                        commented_by.name = String(commented_by.name).trim().length > 0 ? String(commented_by.name).trim() : "-";
                                        if (commentData.player_detail.position && commentData.player_detail.position.length > 0 && commentData.player_detail.position[0] && commentData.player_detail.position[0].name) {
                                            commented_by.position = commentData.player_detail.position[0].name;
                                        }
                                        comment_data.commented_by = commented_by;
                                    }
                                    if (commentData.club_academy_detail && !_.isEmpty(commentData.club_academy_detail)) {
                                        let commented_by = {
                                            "avatar": commentData.club_academy_detail.avatar_url || "-",
                                            "user_id": commentData.club_academy_detail.user_id,
                                            "name": commentData.club_academy_detail.name,
                                            "type": commentData.club_academy_detail.type || "-",
                                            "member_type": commentData.club_academy_detail.member_type,
                                        };
                                        comment_data.commented_by = commented_by;
                                    }
                                    commentDataArrayResponse.push(comment_data);
                                }
                                comments.data = commentDataArrayResponse;
                            }
                            else {
                                comments.data = [];
                            }
                        }
                        data.comments = comments
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
                            "member_type": MEMBER.PLAYER,
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
                            "member_type": p.club_academy_detail.member_type,
                            "type": p.club_academy_detail.type || "",
                        };
                        data.posted_by = posted_by;
                    }
                    response.push(data);
                }
            }
        }
        return response;
    }
}

module.exports = PostsListResponseMapper;