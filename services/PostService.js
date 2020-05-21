const PostUtility = require('../db/utilities/PostUtility');
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');

class PostService {

    constructor() {
        this.postUtilityInst = new PostUtility();
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
            let record = await this.preparePostData(requestedData.reqObj);
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
     * @param {*} [reqObj={}]
     * @returns post data
     * @memberof PostService
     */
    async preparePostData(reqObj = {}) {
        let record = {
            posted_by: requestedData.user_id,
            created_at: Date.now()
        };
        if (reqObj.text && !reqObj.media) {
            record.media = { text: reqObj.text };
        }
        if (!reqObj.text && reqObj.media) {
            record.media = {
                media_url: reqObj.media_url,
                media_type: reqObj.media.type ? reqObj.media.type : ""
            }
        }
        if (reqObj.text && reqObj.media) {
            record.media = {
                text: reqObj.text,
                media_url: reqObj.media_url,
                media_type: reqObj.media.type ? reqObj.media.type : ""
            }
        }
        return Promise.resolve(record);
    }
}

module.exports = PostService;