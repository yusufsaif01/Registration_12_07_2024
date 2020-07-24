const PostService = require('../services/PostService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');
const postValidator = require("../middleware/validators").postValidator;
const POST_MEDIA = require('../constants/PostMedia')
const StorageProvider = require('storage-provider');
const config = require("../config");
const STORAGE_PROVIDER_LOCAL = require('../constants/StorageProviderLocal');

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
                const configForLocal = config.storage;
                let options = STORAGE_PROVIDER_LOCAL.UPLOAD_OPTIONS;
                options.allowed_extensions = POST_MEDIA.ALLOWED_MEDIA_EXTENSIONS;
                let storageProviderInst = new StorageProvider(configForLocal);
                if (req.files.media) {
                    let uploadResponse = await storageProviderInst.uploadDocument(req.files.media, options);
                    reqObj.media_url = uploadResponse.url;
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
     * @api {get} /posts/list?page_no=1&page_size=20&comments=1 posts listing
     * @apiName posts listing
     * @apiGroup Post
     *
     * @apiParam (query) {Number} page_no page number.
     * @apiParam (query) {Number} page_size records per page
     * @apiParam (query) {Number} comments 0 for no data in comments object, 1 for data in comments object
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
     *             "post": {
     *                        "text": "",
     *                        "media_url": "",
     *                        "media_type": "" },
     *              "posted_by": {
     *                 "avatar": "/uploads/avatar/user-avatar.png",
     *                 "user_id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
     *                 "name": "yuvraj singh",
     *                 "type": "professional/amateur/grassroot/Residential/Non-Residential",
     *                 "member_type": "player/club/academy",
     *                 "position": "position of first priority" },
     *             "is_liked": true,
     *             "likes": 5,
     *             "comments": { 
     *                          "total":100,
     *                          "data":[{ "comment": "first comment",
     *                                    "commented_by": {
     *                                    "avatar": "/uploads/avatar/user-avatar.png",
     *                                    "user_id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
     *                                    "name": "yuvraj singh",
     *                                    "type": "professional/Residential/Non-Residential",
     *                                    "member_type": "player/club/academy",
     *                                    "position": "position of first priority" },
     *                                    "commented_at": "2020-05-22T06:58:45.136Z"
     *                                  }]
     *                          }
     *             "created_at": "2020-05-22T06:58:45.136Z"
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

    router.get('/posts/list', checkAuthToken, postValidator.postListQueryValidation, function (req, res) {

        let paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };

        let commentOptions = {
            comments: (req.query && req.query.comments) ? Number(req.query.comments) : 0
        }

        let serviceInst = new PostService();
        responseHandler(req, res, serviceInst.getPostsList({
            paginationOptions, commentOptions, user_id: req.authUser.user_id
        }));
    });

    /**
     * @api {put} /post/:post_id edit post
     * @apiName edit post
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
     *  @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Post not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */
    router.put('/post/:post_id', checkAuthToken, postValidator.addPostAPIValidation, async function (req, res) {
        let reqObj = req.body
        try {
            if (req.files) {
                const configForLocal = config.storage;
                let options = STORAGE_PROVIDER_LOCAL.UPLOAD_OPTIONS;
                options.allowed_extensions = POST_MEDIA.ALLOWED_MEDIA_EXTENSIONS;
                let storageProviderInst = new StorageProvider(configForLocal);
                if (req.files.media) {
                    let uploadResponse = await storageProviderInst.uploadDocument(req.files.media, options);
                    reqObj.media_url = uploadResponse.url;
                }
            }
            let serviceInst = new PostService();
            responseHandler(req, res, serviceInst.editPost({
                reqObj: reqObj,
                user_id: req.authUser.user_id,
                post_id: req.params.post_id
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });

    /**
     * @api {delete} /post/:post_id delete post
     * @apiName delete post
     * @apiGroup Post
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
     * @apiErrorExample {json} UNAUTHORIZED
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
     *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Post not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */
    router.delete('/post/:post_id', checkAuthToken, function (req, res) {
        let serviceInst = new PostService();
        responseHandler(req, res, serviceInst.deletePost({
            post_id: req.params.post_id,
            user_id: req.authUser.user_id
        }));
    })

    /**
     * @api {post} /post/:post_id/like like post
     * @apiName like post
     * @apiGroup Post
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
     * @apiErrorExample {json} VALIDATION_FAILED
	 *     HTTP/1.1 422 Validiation Failed
	 *     {
	 *       "message": "Already liked",
     *       "code": "VALIDATION_FAILED",
     *       "httpCode": 422
	 *     }     
     * 
     * @apiErrorExample {json} VALIDATION_FAILED
	 *     HTTP/1.1 422 Validiation Failed
	 *     {
	 *       "message": "You do not follow the post owner",
     *       "code": "VALIDATION_FAILED",
     *       "httpCode": 422
	 *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Post not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */
    router.post('/post/:post_id/like', checkAuthToken, function (req, res) {
        let serviceInst = new PostService();
        responseHandler(req, res, serviceInst.likePost({
            user_id: req.authUser.user_id,
            post_id: req.params.post_id
        }));
    });

    /**
     * @api {post} /post/:post_id/dislike dislike post
     * @apiName dislike post
     * @apiGroup Post
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
     * @apiErrorExample {json} VALIDATION_FAILED
	 *     HTTP/1.1 422 Validiation Failed
	 *     {
	 *       "message": "Already disliked",
     *       "code": "VALIDATION_FAILED",
     *       "httpCode": 422
	 *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Post not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */
    router.post('/post/:post_id/dislike', checkAuthToken, function (req, res) {
        let serviceInst = new PostService();
        responseHandler(req, res, serviceInst.dislikePost({
            user_id: req.authUser.user_id,
            post_id: req.params.post_id
        }));
    });

    /**
     * @api {post} /post/:post_id/comment add comment
     * @apiName add comment
     * @apiGroup Post
     * 
     * @apiParam (body) {String} comment comment text
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
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Post not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     * @apiErrorExample {json} VALIDATION_FAILED
	 *     HTTP/1.1 422 Validiation Failed
	 *     {
	 *       "message": "You do not follow the post owner",
     *       "code": "VALIDATION_FAILED",
     *       "httpCode": 422
	 *     }
     * 
     * @apiErrorExample {json} VALIDATION_FAILED
	 *     HTTP/1.1 422 Validiation Failed
	 *     {
	 *       "message": "Not allowed to comment",
     *       "code": "VALIDATION_FAILED",
     *       "httpCode": 422
	 *     }
     * 
     */
    router.post('/post/:post_id/comment', checkAuthToken, postValidator.addCommentAPIValidation, function (req, res) {
        let serviceInst = new PostService();
        responseHandler(req, res, serviceInst.addComment({
            reqObj: req.body,
            user_id: req.authUser.user_id,
            member_type: req.authUser.member_type,
            post_id: req.params.post_id
        }));
    });

    /**
     * @api {get} /post/:post_id/comments?page_no=1&page_size=20 comment listing
     * @apiName comment listing
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
     *              "comment": "first comment",
     *              "commented_by": {
     *              "avatar": "/uploads/avatar/user-avatar.png",
     *              "user_id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
     *              "name": "yuvraj singh",
     *              "type": "professional/club/accademy",
     *              "position": "position of first priority" },
     *              "commented_at": "2020-05-22T06:58:45.136Z"
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

    router.get('/post/:post_id/comments', checkAuthToken, function (req, res) {
        let paginationOptions = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };

        let serviceInst = new PostService();
        responseHandler(req, res, serviceInst.getCommentsList({
            paginationOptions, user_id: req.authUser.user_id, post_id: req.params.post_id
        }));
    });
};