
class PostsListResponseMapper {
    map(posts) {
        let response = [];
        if (posts.length) {
            posts.forEach((p) => {
                if (p.post) {
                    let data = {
                        "id": p.post.id,
                        "post": "-",
                        "likes": p.likes,
                        "comments": p.comments
                    };
                    if (p.post.media) {
                        data.post = {
                            text: p.post.media.text ? p.post.media.text : "",
                            media_url: p.post.media.media_url ? p.post.media.media_url : "",
                            media_type: p.post.media.media_type ? p.post.media.media_type : ""
                        }
                        if (p.post.created_at) {
                            let created_at = p.post.created_at;
                            let diff = (new Date().getTime() - created_at.getTime()) / 1000;
                            let second = Math.abs(Math.round(diff));
                            diff = diff / 60;
                            let minutes = Math.abs(Math.round(diff));
                            diff = diff / 60;
                            let hours = Math.abs(Math.round(diff))
                            if (second < 60) {
                                data.created_at = second + " sec";
                            }
                            if (second >= 60 && minutes < 60) {
                                data.created_at = minutes + " min";
                            }
                            if (minutes >= 60 && hours < 24) {
                                data.created_at = hours + " hours";
                            }
                            if (hours >= 24) {
                                const monthNames = ["January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November", "December"
                                ];
                                data.created_at = created_at.getDate() + " " + monthNames[created_at.getMonth()] + " " + created_at.getFullYear();
                            }
                        }
                    }
                    response.push(data);
                }
            });
        }
        return response;
    }
}

module.exports = PostsListResponseMapper;