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
     * @api {post} /master/state/add/:country_id add state
     * @apiName add state
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
     *       "message": "Country not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.post("/master/state/add/:country_id", checkAuthToken, checkRole(["admin"]), locationValidator.addStateAPIValidation, function (req, res) {
        let serviceInst = new LocationService();
        return responseHandler(req, res, serviceInst.addState({ reqObj: req.body, country_id: req.params.country_id }));
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
};
