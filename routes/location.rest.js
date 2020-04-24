const LocationService = require('../services/LocationService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const locationValidator = require("../middleware/validators").locationValidator;

module.exports = (router) => {

    /**
    * @api {get} /master/location/stats location stats
    * @apiName location stats
    * @apiGroup Location
    * 
    * @apiSuccess {String} status success
    * @apiSuccess {String} message Successfully done
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "status": "success",
    *       "message": "Successfully done",
    *       "data": [ {
    *                  "country": "India",
    *                  "country_id": "3bcda0b2-2bc6-4c0c-bc42-82c4aa42ec39",
    *                  "no_of_state": 10,
    *                  "no_of_city": 10 }
    *               ]
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

    router.get("/master/location/stats", function (req, res) {
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.getLocationStats());
    });

    /**
     * @api {post} /master/state/add add state
     * @apiName add state
     * @apiGroup Location
     *
     * @apiParam (body) {String} name state name
     * @apiParam (body) {String} country_id country id
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
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "State already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     *
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Country not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.post("/master/state/add", checkAuthToken, checkRole(["admin"]), locationValidator.addStateAPIValidation, function (req, res) {
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.addState({ reqObj: req.body }));
    });

    /**
     * @api {get} /master/state/list/:country_id state listing
     * @apiName state listing
     * @apiGroup Location
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
     *         "total":1,
     *         "records":[
     *           {
     *             "name": "Delhi",
     *             "id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996"
     *           }
     *         ]
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
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Country not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.get("/master/state/list/:country_id", function (req, res) {
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.getStateList(req.params.country_id));
    });

    /**
     * @api {put} /master/state/:country_id/:state_id edit state
     * @apiName edit state
     * @apiGroup Location
     *
     * @apiParam (body) {String} name state name
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
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "State already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     *
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "State not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Country not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.put("/master/state/:country_id/:state_id", checkAuthToken, checkRole(["admin"]), locationValidator.editStateAPIValidation, function (req, res) {
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.editState({
            reqObj: req.body,
            country_id: req.params.country_id, state_id: req.params.state_id
        }));
    });

    /**
     * @api {post} /master/city/add add city
     * @apiName add city
     * @apiGroup Location
     *
     * @apiParam (body) {String} name city name
     * @apiParam (body) {String} country_id country id
     * @apiParam (body) {String} state_id state id
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
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "City already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     *
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "State not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Country not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.post("/master/city/add", checkAuthToken, checkRole(["admin"]), locationValidator.addCityAPIValidation, function (req, res) {
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.addCity({
            reqObj: req.body
        }));
    });
    /**
     * @api {get} /master/city/list/:country_id/:state_id?page_size=<10>&page_no=<1>&search=<text> city listing
     * @apiName city listing
     * @apiGroup Location
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
     *         "total":1,
     *         "records":[
     *           {
     *             "name": "New Delhi",
     *             "id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996"
     *           }
     *         ]
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

    router.get("/master/city/list/:country_id/:state_id", function (req, res) {
        let paginationOptions = {};
        let filter = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };
        filter = {
            search: (req.query && req.query.search) ? req.query.search : null
        }
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.getCityList({
            country_id: req.params.country_id,
            state_id: req.params.state_id, paginationOptions, filter
        }));
    });

    /**
     * @api {put} /master/city/:country_id/:state_id/:city_id edit city
     * @apiName edit city
     * @apiGroup Location
     *
     * @apiParam (body) {String} name city name
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
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "City already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     *
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "City not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "State not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Country not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.put("/master/city/:country_id/:state_id/:city_id", checkAuthToken, checkRole(["admin"]), locationValidator.editCityAPIValidation, function (req, res) {
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.editCity({
            reqObj: req.body,
            country_id: req.params.country_id, state_id: req.params.state_id,
            city_id: req.params.city_id
        }));
    });
};
