const PostService = require('../services/PostService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');
const FileService = require('../services/FileService');
const postValidator = require("../middleware/validators").postValidator;
const POST_MEDIA = require('../constants/PostMedia')

module.exports = (router) => {

    /**
     * @api {post} /post/add add post
     * @apiName add post
     * @apiGroup Post
     * 
     * @apiParam (body) {String} text text of post
     * @apiParam (body) {String} media media file for the post
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done"
     *     }
     *
     * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "message": "Internal Server Error",
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "httpCode": 500
     *     }
     * 
     */
    router.post('/post/add', checkAuthToken, postValidator.addPostAPIValidation, async function (req, res) {
        let reqObj = req.body
        try {
            if (req.files) {
                const _fileInst = new FileService();
                if (req.files.media) {
                    let media_url = await _fileInst.uploadFile(req.files.media, "./documents/", req.files.media.name, POST_MEDIA.ALLOWED_MEDIA_EXTENSIONS);
                    reqObj.media_url = media_url;
                    reqObj.media = req.files.media;
                }
            }
            let serviceInst = new PostService();
            responseHandler(req, res, serviceInst.addPost({
                reqObj: reqObj,
                user_id: req.authUser.user_id
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });

    /**
     * @api {get} /posts/list?page_no=1&page_size=20 posts listing
     * @apiName posts listing
     * @apiGroup Post
     *
     * @apiParam (query) {Number} page_no page number.
     * @apiParam (query) {Number} page_size records per page
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": { 
     *         "total":100,
     *         "records":[
     *           {
     *             "id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
     *             "posts": {
     *                        "text": "",
     *                        "media_url": "",
     *                        "media_type": "" },
     *             "is_liked": true,
     *             "likes": 5,
     *             "comments": 10,
     *             "created_at": "15 min"
     *           }
     *         ]}
     *     }
     *
     * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "message": "Internal Server Error",
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "httpCode": 500
     *     }
     *
     * @apiErrorExample {json} UNAUTHORIZED
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
     *     } 
     * 
     */

    router.get('/posts/list', checkAuthToken, function (req, res) {
        let paginationOptions = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };

        let serviceInst = new PostService();
        responseHandler(req, res, serviceInst.getPostsList({
            paginationOptions, user_id: req.authUser.user_id
        }));
    });
};