const PostUtility = require('../db/utilities/PostUtility');
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const POST_MEDIA = require('../constants/PostMedia');
const errors = require("../errors");
const ConnectionUtility = require('../db/utilities/ConnectionUtility');
const CommentUtility = require('../db/utilities/CommentUtility');
const LikeUtility = require('../db/utilities/LikeUtility');
const PostsListResponseMapper = require("../dataModels/responseMapper/PostsListResponseMapper");
const uuidv4 = require('uuid/v4');
const MEMBER = require('../constants/MemberType');
const PLAYER = require('../constants/PlayerType');
const PlayerUtility = require('../db/utilities/PlayerUtility');

class PostService {

    constructor() {
        this.postUtilityInst = new PostUtility();
        this.connectionUtilityInst = new ConnectionUtility();
        this.commentUtilityInst = new CommentUtility();
        this.likeUtilityInst = new LikeUtility();
        this.playerUtilityInst = new PlayerUtility();
    }

    /**
     * add new post
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async addPost(requestedData = {}) {
        try {
            await this.addPostValiation(requestedData);
            let record = await this.preparePostData(requestedData);
            await this.postUtilityInst.insert(record)
            return Promise.resolve();
        } catch (e) {
            console.log("Error in addPost() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * validates request Data for addPost
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async addPostValiation(requestedData = {}) {
        if (!requestedData.reqObj.text && !requestedData.reqObj.media) {
            return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.TEXT_OR_IMAGE_REQUIRED));
        }
        return Promise.resolve();
    }

    /**
     * prepares post data
     *
     * @param {*} [requestedData={}]
     * @returns post data
     * @memberof PostService
     */
    async preparePostData(requestedData = {}) {
        let record = {
            posted_by: requestedData.user_id,
            created_at: Date.now()
        };
        let reqObj = requestedData.reqObj;
        if (reqObj.text && !reqObj.media) {
            record.media = { text: reqObj.text };
        }
        if (!reqObj.text && reqObj.media) {
            record.media = {
                media_url: reqObj.media_url,
                media_type: POST_MEDIA.ALLOWED_MEDIA_TYPE
            }
        }
        if (reqObj.text && reqObj.media) {
            record.media = {
                text: reqObj.text,
                media_url: reqObj.media_url,
                media_type: POST_MEDIA.ALLOWED_MEDIA_TYPE
            }
        }
        return Promise.resolve(record);
    }

    /**
     * get posts list
     *
     * @param {*} [requestedData={}]
     * @returns list of posts
     * @memberof PostService
     */
    async getPostsList(requestedData = {}) {
        try {
            let paginationOptions = requestedData.paginationOptions || {};
            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount };
            let data = await this.connectionUtilityInst.aggregate([{ $match: { user_id: requestedData.user_id, is_deleted: false } },
            { $project: { user_id_for_post: { $concatArrays: ["$followings", ["$user_id"]] }, _id: 0 } }, { $unwind: { path: "$user_id_for_post" } },
            { "$lookup": { "from": "posts", "localField": "user_id_for_post", "foreignField": "posted_by", "as": "post" } },
            { $unwind: { path: "$post" } }, { $match: { "post.is_deleted": false } }, { $project: { post: { id: 1, posted_by: 1, media: 1, created_at: 1 } } },
            { "$lookup": { "from": "likes", "localField": "post.id", "foreignField": "post_id", "as": "like_documents" } },
            { $project: { post: 1, filtered_likes: { $filter: { input: "$like_documents", as: "likeDocument", cond: { $eq: ["$$likeDocument.is_deleted", false] } } } } },
            { $project: { post: 1, likes: { $size: "$filtered_likes" }, likedByMe: { $filter: { input: "$filtered_likes", as: "likeDocument", cond: { $eq: ["$$likeDocument.liked_by", requestedData.user_id] } } } } },
            { "$lookup": { "from": "comments", "localField": "post.id", "foreignField": "post_id", "as": "comment_documents" } },
            { $project: { post: 1, likedByMe: 1, likes: 1, comments: { $size: { $filter: { input: "$comment_documents", as: "commentDocument", cond: { $eq: ["$$commentDocument.is_deleted", false] } } } } } },
            { $sort: { "post.created_at": -1 } }, { $skip: options.skip }, { $limit: options.limit }
            ]);
            let totalPosts = await this.connectionUtilityInst.aggregate([{ $match: { user_id: requestedData.user_id, is_deleted: false } },
            { $project: { user_id_for_post: { $concatArrays: ["$followings", ["$user_id"]] }, _id: 0 } }, { $unwind: { path: "$user_id_for_post" } },
            { "$lookup": { "from": "posts", "localField": "user_id_for_post", "foreignField": "posted_by", "as": "post" } },
            { $unwind: { path: "$post" } }, { $match: { "post.is_deleted": false } }, { $project: { post: { id: 1, posted_by: 1, media: 1, created_at: 1 } } },
            ]);
            data = new PostsListResponseMapper().map(data);
            let record = { total: totalPosts.length, records: data }
            return Promise.resolve(record)
        }
        catch (e) {
            console.log("Error in getPostsList() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * edit post
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async editPost(requestedData = {}) {
        try {
            let currentDataOfPost = await this.editPostValiation(requestedData);
            let updatedRecord = await this.prepareUpdatedPostData(requestedData, currentDataOfPost);
            await this.postUtilityInst.updateOne({ id: requestedData.post_id }, updatedRecord);
            return Promise.resolve();
        } catch (e) {
            console.log("Error in editPost() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * validates request data for editPost
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async editPostValiation(requestedData = {}) {
        try {
            let foundPost = await this.postUtilityInst.findOne({ id: requestedData.post_id, posted_by: requestedData.user_id });
            if (!foundPost) {
                return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.POST_NOT_FOUND));
            }
            if (!requestedData.reqObj.text && !requestedData.reqObj.media) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.TEXT_OR_IMAGE_REQUIRED));
            }
            return Promise.resolve(foundPost);
        } catch (e) {
            console.log("Error in editPostValidation() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * prepare updated post data
     *
     * @param {*} [requestedData={}]
     * @param {*} [currentDataOfPost={}]
     * @returns updated record
     * @memberof PostService
     */
    async prepareUpdatedPostData(requestedData = {}, currentDataOfPost = {}) {
        let record = {
            updated_at: Date.now()
        };
        let reqObj = requestedData.reqObj;
        if (reqObj.text && !reqObj.media) {
            if (currentDataOfPost.media && currentDataOfPost.media.text && !currentDataOfPost.media.media_url) {
                record.media = { text: reqObj.text };
            }
            if (currentDataOfPost.media && currentDataOfPost.media.text && currentDataOfPost.media.media_url) {
                currentDataOfPost.media.text = reqObj.text;
                record.media = currentDataOfPost.media;
            }
        }
        if (!reqObj.text && reqObj.media) {
            if (currentDataOfPost.media && !currentDataOfPost.media.text && currentDataOfPost.media.media_url) {
                record.media = {
                    media_url: reqObj.media_url,
                    media_type: POST_MEDIA.ALLOWED_MEDIA_TYPE
                }
            }
            if (currentDataOfPost.media && currentDataOfPost.media.text && currentDataOfPost.media.media_url) {
                currentDataOfPost.media.media_url = reqObj.media_url;
                currentDataOfPost.media.media_type = POST_MEDIA.ALLOWED_MEDIA_TYPE;
                record.media = currentDataOfPost.media;
            }
        }
        if (reqObj.text && reqObj.media) {
            record.media = {
                text: reqObj.text,
                media_url: reqObj.media_url,
                media_type: POST_MEDIA.ALLOWED_MEDIA_TYPE
            }
        }
        return Promise.resolve(record);
    }

    /**
     * delete post
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async deletePost(requestedData = {}) {
        try {
            let foundPost = await this.postUtilityInst.findOne({ id: requestedData.post_id, posted_by: requestedData.user_id });
            if (foundPost) {
                await this.postUtilityInst.findOneAndUpdate({ id: requestedData.post_id }, { is_deleted: true, deleted_at: Date.now() });
                return Promise.resolve()
            }
            throw new errors.NotFound(RESPONSE_MESSAGE.POST_NOT_FOUND);
        } catch (e) {
            console.log("Error in deletePost() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * like a post
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async likePost(requestedData = {}) {
        try {
            let foundPost = await this.postUtilityInst.findOne({ id: requestedData.post_id });
            if (foundPost) {
                await this.isFollowingPostOwner(requestedData, foundPost);
                let likeRecord = await this.likeUtilityInst.findOne({ post_id: requestedData.post_id, liked_by: requestedData.user_id });
                if (likeRecord && likeRecord.is_deleted === false) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.ALREADY_LIKED));
                }
                let updatedRecord = { id: likeRecord ? likeRecord.id : uuidv4(), post_id: requestedData.post_id, liked_by: requestedData.user_id, created_at: Date.now(), is_deleted: false };
                await this.likeUtilityInst.updateOne({ post_id: requestedData.post_id, liked_by: requestedData.user_id }, updatedRecord, { upsert: true });
                return Promise.resolve()
            }
            throw new errors.NotFound(RESPONSE_MESSAGE.POST_NOT_FOUND);
        } catch (e) {
            console.log("Error in likePost() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
    * checks if the user follows the post owner
    *
    * @param {*} [requestedData={}]
    * @param {*} [postData={}]
    * @returns success or error response
    * @memberof PostService
    */
    async isFollowingPostOwner(requestedData = {}, postData = {}) {
        try {
            let following = await this.connectionUtilityInst.findOne({
                user_id: requestedData.user_id, followings: postData.posted_by
            }, { followings: 1, _id: 0 });
            if (!following && requestedData.user_id !== postData.posted_by) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.YOU_DO_NOT_FOLLOW_THE_POST_OWNER));
            }
            return Promise.resolve();
        } catch (e) {
            console.log("Error in isFollowingPostOwner() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * dislike a post
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async dislikePost(requestedData = {}) {
        try {
            let foundPost = await this.postUtilityInst.findOne({ id: requestedData.post_id });
            if (foundPost) {
                let likeRecord = await this.likeUtilityInst.findOne({ post_id: requestedData.post_id, liked_by: requestedData.user_id, is_deleted: false });
                if (!likeRecord) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.ALREADY_DISLIKED));
                }
                let updatedRecord = { is_deleted: true };
                await this.likeUtilityInst.updateOne({ post_id: requestedData.post_id, liked_by: requestedData.user_id }, updatedRecord);
                return Promise.resolve()
            }
            throw new errors.NotFound(RESPONSE_MESSAGE.POST_NOT_FOUND);
        } catch (e) {
            console.log("Error in dislikePost() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * add comment to a post
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async addComment(requestedData = {}) {
        try {
            await this.isAllowedToComment(requestedData);
            let foundPost = await this.postUtilityInst.findOne({ id: requestedData.post_id });
            if (foundPost) {
                await this.isFollowingPostOwner(requestedData, foundPost);
                let record = {
                    post_id: requestedData.post_id,
                    comment: requestedData.reqObj.comment,
                    commented_by: requestedData.user_id,
                    created_at: Date.now()
                };
                await this.commentUtilityInst.insert(record);
                return Promise.resolve();
            }
            throw new errors.NotFound(RESPONSE_MESSAGE.POST_NOT_FOUND);
        } catch (e) {
            console.log("Error in addComment() of PostService", e);
            return Promise.reject(e);
        }
    }

    /**
     * checks if the user is allowed to comment on a post
     *
     * @param {*} [requestedData={}]
     * @returns success or error response
     * @memberof PostService
     */
    async isAllowedToComment(requestedData = {}) {
        try {
            if (requestedData.member_type === MEMBER.PLAYER) {
                let playerDetail = await this.playerUtilityInst.findOne({ user_id: requestedData.user_id }, { player_type: 1 });
                if (playerDetail && !playerDetail.player_type) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.NOT_ALLOWED_TO_COMMENT));
                }
                if (playerDetail && playerDetail.player_type && playerDetail.player_type !== PLAYER.PROFESSIONAL) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.NOT_ALLOWED_TO_COMMENT));
                }
            }
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in isAllowedToComment() of PostService", e);
            return Promise.reject(e);
        }
    }
}

module.exports = PostService;