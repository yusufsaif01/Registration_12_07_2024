class PostsListResponseMapper {
    map(posts) {
        let response = [];
        if (posts.length) {
            posts.forEach((p) => {
                if (p.post) {
                    let data = {
                        "id": p.post.id,
                        "post": "-",
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
                    response.push(data);
                }
            });
        }
        return response;
    }
}

module.exports = PostsListResponseMapper;