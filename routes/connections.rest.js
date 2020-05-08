const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');
const connectionValidator = require("../middleware/validators").connectionValidator;
const ConnectionService = require('../services/ConnectionService');

module.exports = (router) => {

    /**
     * @api {post} /connection/request/send Send foot mate request
     * @apiName Send FootMate Request
     * @apiGroup Connections
     *   
     * @apiParam (body) {String} to user_id of the user to whom request will be send
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
     * @apiErrorExample {json} Unauthorized
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
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
    router.post('/connection/request/send', connectionValidator.connectionRequestAPIValidation, checkAuthToken, function (req, res) {
        let sent_to = req.body.to;
        let send_by = req.user.user_id;
        responseHandler(req, res, Promise.resolve());
    });

    /**
     * @api {patch} /connection/request/cancel Cancel foot mate request
     * @apiName Cancel FootMate Request
     * @apiGroup Connections
     *   
     * @apiParam (body) {String} to user_id of the user to whom request will be cancelled
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
     * @apiErrorExample {json} Unauthorized
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
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
    router.patch('/connection/request/cancel', connectionValidator.connectionRequestAPIValidation, checkAuthToken, function (req, res) {
        let sent_to = req.body.to;
        let send_by = req.user.user_id;
        responseHandler(req, res, Promise.resolve());
    });

    /**
     * @api {patch} /connection/follow Follow user
     * @apiName Follow user
     * @apiGroup Connections
     *   
     * @apiParam (body) {String} to user_id of the user to follow
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
     * @apiErrorExample {json} Unauthorized
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
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
    router.patch('/connection/follow', connectionValidator.connectionRequestAPIValidation, checkAuthToken, function (req, res) {
        let serviceInst = new ConnectionService();
        responseHandler(req, res, serviceInst.followMember({ sent_by: req.authUser.user_id, send_to: req.body.to }));
    });

    /**
     * @api {patch} /connection/unfollow Unfollow user
     * @apiName Unfollow user
     * @apiGroup Connections
     *   
     * @apiParam (body) {String} to user_id of the user to unfollow
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
     * @apiErrorExample {json} Unauthorized
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
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
    router.patch('/connection/unfollow', connectionValidator.connectionRequestAPIValidation, checkAuthToken, function (req, res) {
        let serviceInst = new ConnectionService();
        responseHandler(req, res, serviceInst.unfollowMember({ sent_by: req.authUser.user_id, send_to: req.body.to }));
    });

    /**
     * @api {patch} /connection/request/accept/:request_id Accept footmate request
     * @apiName Accept footmate request
     * @apiGroup Connections
     *   
     * @apiParam (params) {String} request_id request_id of the connection request
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
     * @apiErrorExample {json} Unauthorized
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
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
    router.patch('/connection/request/accept/:request_id', connectionValidator.connectionRequestAPIValidation, checkAuthToken, function (req, res) {
        let connectionRequestId = req.params.request_id;
        let send_by = req.user.user_id;
        responseHandler(req, res, Promise.resolve());
    });

    /**
     * @api {patch} /connection/request/reject/:request_id Reject footmate request
     * @apiName Reject footmate request
     * @apiGroup Connections
     *   
     * @apiParam (params) {String} request_id request_id of the connection request
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
     * @apiErrorExample {json} Unauthorized
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
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
    router.patch('/connection/request/reject/:request_id', connectionValidator.connectionRequestAPIValidation, checkAuthToken, function (req, res) {
        let connectionRequestId = req.params.request_id;
        let send_by = req.user.user_id;
        responseHandler(req, res, Promise.resolve());
    });

    /**
     * @api {get} /connection/list?page_no=1&page_size=20&position=<positions>&player_category=<player_category>&age=<age_range>&country=<country>&city=<city>&state=<state>&strong_foot=<strong_foot> footmates listing
     * @apiName Footmates listing
     * @apiGroup Connections
     *
     * @apiParam (query) {String} page_no page number.
     * @apiParam (query) {String} page_size records per page
     * @apiParam (query) {String} position comma separated position
     * @apiParam (query) {String} player_category comma separated player_category
     * @apiParam (query) {String} age comma separated age range
     * @apiParam (query) {String} country country name
     * @apiParam (query) {String} state state name
     * @apiParam (query) {String} city city name
     * @apiParam (query) {String} strong_foot comma separated strong_foot
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
     *           "total": "10",
     *           "records": [
     *               {
     *                   "name": "Nishikant",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test123",
     *                   "request_id": "request1",
     *                   "mutuals": 5
     *               },
     *               {
     *                   "name": "Pushpam",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test1234",
     *                   "request_id": "request2",
     *                   "mutuals": 10
     *               },
     *               {
     *                   "name": "Deepak",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test12345",
     *                   "request_id": "request3",
     *                   "mutuals": 4
     *               }
     *           ]
     *       }
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
    router.get('/connection/list', checkAuthToken, function (req, res) {
        let page_no = req.query.page_no;
        let page_size = req.query.page_size;

        let filters = {
            position: (req.query && req.query.position) ? req.query.position.split(",") : null,
            player_type: (req.query && req.query.player_category) ? req.query.player_category.split(",") : null,
            age: (req.query && req.query.age) ? req.query.age.split(",") : null,
            country: (req.query && req.query.country) ? req.query.country : null,
            state: (req.query && req.query.state) ? req.query.state : null,
            city: (req.query && req.query.city) ? req.query.city : null,
            strong_foot: (req.query && req.query.strong_foot) ? req.query.strong_foot.split(",") : null,
        };

        responseHandler(req, res, Promise.resolve({
            "total": "10",
            "records": [
                {
                    "name": "Nishikant",
                    "position": "goalkeeper",
                    "player_type": "grassroot",
                    "avatar": "/uploads/avatar/user-avatar.png",
                    "user_id": "test123",
                    "request_id": "request1",
                    "mutuals": 5
                },
                {
                    "name": "Pushpam",
                    "position": "goalkeeper",
                    "player_type": "grassroot",
                    "avatar": "/uploads/avatar/user-avatar.png",
                    "user_id": "test1234",
                    "request_id": "request2",
                    "mutuals": 10
                },
                {
                    "name": "Deepak",
                    "position": "goalkeeper",
                    "player_type": "grassroot",
                    "avatar": "/uploads/avatar/user-avatar.png",
                    "user_id": "test12345",
                    "request_id": "request3",
                    "mutuals": 4
                }
            ]
        }));
    });

    /**
     * @api {get} /connection/mutuals/:mutual_with mutual footmates listing
     * @apiName Mutual Footmates listing
     * @apiGroup Connections
     *
     * @apiParam (params) {String} mutual_with user_id of the user to which mutual with
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
     *           "total": "10",
     *           "records": [
     *               {
     *                   "name": "Nishikant",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test123"
     *               },
     *               {
     *                   "name": "Pushpam",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test1234"
     *               },
     *               {
     *                   "name": "Deepak",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test12345"
     *               }
     *           ]
     *       }
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
    router.get('/connection/mutuals/:mutual_with', connectionValidator.mutualAPIValidation, checkAuthToken, function (req, res) {
        let mutual_with = req.params.mutual_with;
        responseHandler(req, res, Promise.resolve({
            "total": "10",
            "records": [
                {
                    "name": "Nishikant",
                    "position": "goalkeeper",
                    "player_type": "grassroot",
                    "avatar": "/uploads/avatar/user-avatar.png",
                    "user_id": "test123"
                },
                {
                    "name": "Pushpam",
                    "position": "goalkeeper",
                    "player_type": "grassroot",
                    "avatar": "/uploads/avatar/user-avatar.png",
                    "user_id": "test1234"
                }
            ]
        }));
    });

    /**
     * @api {get} connection/request/list?page_no=1&page_size=10 footmates request listing
     * @apiName Footmates Request listing
     * @apiGroup Connections
     *
     * @apiParam (query) {String} page_no page number.
     * @apiParam (query) {String} page_size records per page
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
     *           "total": "10",
     *           "records": [
     *               {
     *                   "name": "Nishikant",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test123",
     *                   "request_id": "request1",
     *                   "mutuals": 5
     *               },
     *               {
     *                   "name": "Pushpam",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test1234",
     *                   "request_id": "request2",
     *                   "mutuals": 10
     *               },
     *               {
     *                   "name": "Deepak",
     *                   "position": "goalkeeper",
     *                   "player_type": "grassroot",
     *                   "avatar": "/uploads/avatar/user-avatar.png",
     *                   "user_id": "test12345",
     *                   "request_id": "request3",
     *                   "mutuals": 6
     *               }
     *           ]
     *       }
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
    router.get('/connection/request/list', checkAuthToken, function (req, res) {
        let page_no = req.query.page_no;
        let page_size = req.query.page_size;

        responseHandler(req, res, Promise.resolve({
            "total": "10",
            "records": [
                {
                    "name": "Nishikant",
                    "position": "goalkeeper",
                    "player_type": "grassroot",
                    "avatar": "/uploads/avatar/user-avatar.png",
                    "user_id": "test123",
                    "request_id": "request1",
                    "mutuals": 5
                },
                {
                    "name": "Pushpam",
                    "position": "goalkeeper",
                    "player_type": "grassroot",
                    "avatar": "/uploads/avatar/user-avatar.png",
                    "user_id": "test1234",
                    "request_id": "request2",
                    "mutuals": 10
                }
            ]
        }));
    });
}