const UserService = require('../services/UserService');
const UserRegistrationService = require('../services/UserRegistrationService');
const responseHandler = require('../ResponseHandler');

module.exports = (router) => {

    /**
     * @api {post} /user/create create user information
     * @apiName Create user
     * @apiGroup User
     *
     * @apiParam (body) {String} key1 description.
     * @apiParam (body) {String} key2 description
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
    router.post('/user/create', function (req, res) {
        let serviceInst = new UserRegistrationService()
        responseHandler(req, res, serviceInst.employeeRegistration(req.body));
    });

    /**
     * @api {get} /user/list?page_no=1&limit=10&search=xyz user listing
     * @apiName user listing
     * @apiGroup User
     *
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": []
     *     }
     *
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
    router.get('/user/list', function (req, res) {
        let paginationOptions = {};
        let sortOptions = {};
        let filter = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.limit) ? Number(req.query.limit) : 10
        };

        sortOptions = {
            sort_by: (req.query && req.query.sort_by) ? req.query.sort_by : "",
            sort_order: (req.query && req.query.sort_order) ? req.query.sort_order : 1
        };

        filter = {
            search: (req.query && req.query.search) ? req.query.search : null
        }

        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.getList({ paginationOptions, sortOptions, filter }));
    });


    /**
     * @api {get} /user/:id get user details
     * @apiName user Details
     * @apiGroup User
     *
     * @apiParam (param) {String} id id of user to fetch details
     *
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": {}
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
    router.get('/user/:id', function (req, res) {
        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.getDetails({ id: req.params.id }));
    });


    /**
     * @api {put} /user/:id update user information
     * @apiName Update user
     * @apiGroup User
     *
     * @apiParam (param) {String} id id of user to update
     *
     * @apiParam (body) {String} key1 description
     * @apiParam (body) {String} key2 description
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
    router.put('/user/:id', function (req, res) {
        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.update({ id: req.params.id, updateValues: req.body }));
    });


    /**
     * @api {delete} /user/:id delete user
     * @apiName Delete user
     * @apiGroup User
     *
     * @apiParam (param) {String} id id of user to delete
     *
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
    router.delete('/user/:id', function (req, res) {
        let serviceInst = new UserService();
        responseHandler(req, res, serviceInst.update({ id: req.params.id, updateValues: { deleted_at: new Date() } }));
    });

};
