const UserService = require('../services/UserService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');
const LoginUtility = require('../db/utilities/LoginUtility');


module.exports = (router) => {
    /**
     * @api {get} /member/player/list?page_no=<1>&page_size=<20>&sort_by=<created_at>&sort_order=<1>&search=<text>&from=<from_date>&to=<to_date>&email=<email>&name=<name>&position=<position>&type=<type>&profile_status=<profile_status>&email_verified=<email_verified>  player listing
     * @apiName player listing
     * @apiGroup Member
     * 
	 * @apiParam (query) {String} page_no page number.
	 * @apiParam (query) {String} page_size records per page
     * @apiParam (query) {String} sort_by sort by field name
     * @apiParam (query) {String} sort_order order to sort (0 - Descending, 1 - Ascending)
     * @apiParam (query) {String} search text search, this search will be done on name, position, email, type
     * @apiParam (query) {String} from from date of player register
     * @apiParam (query) {String} to to date of player register
     * @apiParam (query) {String} email email of the player
     * @apiParam (query) {String} name name of the player
     * @apiParam (query) {String} position name of the position
     * @apiParam (query) {String} type grassroot/amateur/professional
     * @apiParam (query) {String} profile_status verified/unverified
     * @apiParam (query) {String} email_verified true/false
     * 
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
     *             "name": "first_name + last_name",
     *             "position": "position of first priority",
     *             "type":"grassroot/professional/amateur",
     *             "email":"email of the player",
     *             "status":"active/inactive/blocked/pending"
     *           }
     *         ],
     *         "players_count": {
     *           "grassroot":10,
     *           "professional":20,
     *           "amateur":15   
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
     */
    router.get('/member/player/list', checkAuthToken, function (req, res) {
        let paginationOptions = {};
        let sortOptions = {};
        let filter = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };
        sortOptions = {
            sort_by: (req.query && req.query.sort_by) ? req.query.sort_by : "",
            sort_order: (req.query && req.query.sort_order) ? req.query.sort_order : 1
        };
        filter = {
            search: (req.query && req.query.search) ? req.query.search : null
        };
        filterConditions = {
            from: (req.query && req.query.from) ? req.query.from : null,
            to: (req.query && req.query.to) ? req.query.to : null,
            email: (req.query && req.query.email) ? req.query.email : null,
            name: (req.query && req.query.name) ? req.query.name : null,
            position: (req.query && req.query.position) ? req.query.position : null,
            type: (req.query && req.query.type) ? req.query.type : null,
            profile_status: (req.query && req.query.profile_status) ? req.query.profile_status : null,
            email_verified: (req.query && req.query.email_verified) ? req.query.email_verified : null,
        }
        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.getList({
            paginationOptions, sortOptions, filter, filterConditions,
            member_type: 'player'
        }));
    });
    /**
     * @api {get} /member/club/list?page_no=1&page_size=20&sort_by=created_at&sort_order=1&search=text&from=<from_date>&to=<to_date>&email=<email>&name=<name>&profile_status=<profile_status>&email_verified=<email_verified> club listing
     * @apiName club listing
     * @apiGroup Member
     *
     * @apiParam (query) {String} page_no page number.
	 * @apiParam (query) {String} page_size records per page
     * @apiParam (query) {String} sort_by sort by field name
     * @apiParam (query) {String} sort_order order to sort (0 - Descending, 1 - Ascending)
     * @apiParam (query) {String} search text search, this search will be done on name, position, email, type
     * @apiParam (query) {String} from from date of player register
     * @apiParam (query) {String} to to date of player register
     * @apiParam (query) {String} email email of the player
     * @apiParam (query) {String} name name of the player
     * @apiParam (query) {String} profile_status verified/unverified
     * @apiParam (query) {String} email_verified true/false
     * 
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
     *             "name": "name of the academy",
     *             "no_of_players": "number of players associated",
     *             "email":"email of the academy",
     *             "status":"active/inactive/blocked/pending"
     *            }
     *         ]
     *       }
     *    }
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
    router.get('/member/club/list', checkAuthToken, function (req, res) {
        let paginationOptions = {};
        let sortOptions = {};
        let filter = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };
        sortOptions = {
            sort_by: (req.query && req.query.sort_by) ? req.query.sort_by : "",
            sort_order: (req.query && req.query.sort_order) ? req.query.sort_order : 1
        };
        filter = {
            search: (req.query && req.query.search) ? req.query.search : null
        }

        filterConditions = {
            from: (req.query && req.query.from) ? req.query.from : null,
            to: (req.query && req.query.to) ? req.query.to : null,
            email: (req.query && req.query.email) ? req.query.email : null,
            name: (req.query && req.query.name) ? req.query.name : null,
            profile_status: (req.query && req.query.profile_status) ? req.query.profile_status : null,
            email_verified: (req.query && req.query.email_verified) ? req.query.email_verified : null,
        }

        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.getList({
            paginationOptions, sortOptions, filter, filterConditions,
            member_type: 'club'
        }));
    });
    /**
     * @api {get} /member/academy/list?page_no=1&page_size=20&sort_by=created_at&sort_order=1&search=text&from=<from_date>&to=<to_date>&email=<email>&name=<name>&profile_status=<profile_status>&email_verified=<email_verified> academy listing
     * @apiName academy listing
     * @apiGroup Member
     *
     * @apiParam (query) {String} page_no page number.
	 * @apiParam (query) {String} page_size records per page
     * @apiParam (query) {String} sort_by sort by field name
     * @apiParam (query) {String} sort_order order to sort (0 - Descending, 1 - Ascending)
     * @apiParam (query) {String} search text search, this search will be done on name, position, email, type
     * @apiParam (query) {String} from from date of player register
     * @apiParam (query) {String} to to date of player register
     * @apiParam (query) {String} email email of the player
     * @apiParam (query) {String} name name of the player
     * @apiParam (query) {String} profile_status verified/unverified
     * @apiParam (query) {String} email_verified true/false
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
     *             "name": "name of the academy",
     *             "no_of_players": "number of players associated",
     *             "email":"email of the academy",
     *             "status":"active/inactive/blocked/pending"
     *            }
     *         ]
     *       }
     *    }
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
    router.get('/member/academy/list', checkAuthToken, function (req, res) {
        let paginationOptions = {};
        let sortOptions = {};
        let filter = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };
        sortOptions = {
            sort_by: (req.query && req.query.sort_by) ? req.query.sort_by : "",
            sort_order: (req.query && req.query.sort_order) ? req.query.sort_order : 1
        };
        filter = {
            search: (req.query && req.query.search) ? req.query.search : null
        }

        filterConditions = {
            from: (req.query && req.query.from) ? req.query.from : null,
            to: (req.query && req.query.to) ? req.query.to : null,
            email: (req.query && req.query.email) ? req.query.email : null,
            name: (req.query && req.query.name) ? req.query.name : null,
            profile_status: (req.query && req.query.profile_status) ? req.query.profile_status : null,
            email_verified: (req.query && req.query.email_verified) ? req.query.email_verified : null,
        }
        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.getList({
            paginationOptions, sortOptions, filter, filterConditions,
            member_type: 'academy'
        }));
    });
    /**
     * @api {put} /member/status-activate/:id member status activate
     * @apiName Status-activate
     * @apiGroup Member
     *
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
 
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
     * @apiErrorExample {json} Unauthorized
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
	 *     }
     * 
     *@apiErrorExample {json} Conflict
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "status is already active",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     */
    router.put('/member/status-activate/:id', checkAuthToken, function (req, res) {
        try {
            if (!req.params.id) {
                return Promise.reject(new errors.ValidationFailed(
                    "user id is required"
                ));
            }
            let id = req.params.id
            let serviceInst = new UserService();
            responseHandler(req, res,serviceInst.activate(id))
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    })
        /**
     * @api {put} /member/status-deactivate/:id member status deactivate
     * @apiName Status-activate
     * @apiGroup Member
     *
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
 
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
     * @apiErrorExample {json} Unauthorized
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
	 *     }
     * 
     *@apiErrorExample {json} Conflict
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "status is already blocked",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     */
    router.put('/member/status-deactivate/:id', checkAuthToken, function (req, res) {
        try {
            if (!req.params.id) {
                return Promise.reject(new errors.ValidationFailed(
                    "user id is required"
                ));
            }
            let id = req.params.id
            let serviceInst = new UserService();
            responseHandler(req, res,serviceInst.deactivate(id))
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    })
        /**
     * @api {delete} /member/delete/:id member delete
     * @apiName Delete
     * @apiGroup Member
     *
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
 
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
     * @apiErrorExample {json} Unauthorized
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
	 *     }
     * 
     */
    router.delete('/member/delete/:id', checkAuthToken, function (req, res) {
        try {
            if (!req.params.id) {
                return Promise.reject(new errors.ValidationFailed(
                    "user id is required"
                ));
            }
            let id = req.params.id
            let serviceInst = new UserService();
            responseHandler(req, res,serviceInst.delete(id))
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    })
};
