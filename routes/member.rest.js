const UserService = require('../services/UserService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');
const LoginUtility = require('../db/utilities/LoginUtility');


module.exports = (router) => {
    /**
     * @api {get} /member/player/list?page_no=1&page_size=20&sort_by=created_at&sort_order=1&search=text player listing
     * @apiName player listing
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
     *       "data": { "total":100,
     *                 "records":[{
     *                  "name": "first_name + last_name",
     *                  "position": "position of first priority",
     *                  "type":"grassroot/professional/amateur",
     *                  "email":"email of the player",
     *                  "status":"active/inactive/blocked/pending"
     *                           }],
     *                  “players_count”: {
     *                  "grassroot":10,
     *                  "professional":20,
     *                  "amateur":15   }
     *                }
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
     * @api {get} /member/club/list?page_no=1&page_size=20&sort_by=created_at&sort_order=1&search=text club listing
     * @apiName club listing
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
     *       "data": {  "total":100,
     *                  "records":[{
     *                  "name": "name of the club",
     *                  "no_of_players": "number of players associated",
     *                  "email":"email of the club",
     *                  "status":"active/inactive/blocked/pending"
     *               }]}
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
        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.getList({
            paginationOptions, sortOptions, filter,
            member_type: 'club'
        }));
    });
    /**
 * @api {get} /member/academy/list?page_no=1&page_size=20&sort_by=created_at&sort_order=1&search=text academy listing
 * @apiName academy listing
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
 *       "data": {  "total":100,
 *                  "records":[{
 *                  "name": "name of the academy",
 *                  "no_of_players": "number of players associated",
 *                  "email":"email of the academy",
 *                  "status":"active/inactive/blocked/pending"
 *               }]}
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
        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.getList({
            paginationOptions, sortOptions, filter,
            member_type: 'academy'
        }));
    });

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
