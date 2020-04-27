const PlayerSpecializationService = require('../services/PlayerSpecializationService');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const playerSpecializationValidator = require("../middleware/validators").playerSpecializationValidator;

module.exports = (router) => {
    /**
     * @api {post} /master/player-specialization/ability/add add ability
     * @apiName add ability
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name ability name
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
	 *       "message": "Ability already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     */

    router.post("/master/player-specialization/ability/add", checkAuthToken,
        playerSpecializationValidator.AbilityAPIValidation, checkRole(["admin"]), function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.addAbility({ reqObj: req.body }));
        });

    /**
     * @api {get} /master/player-specialization/ability/list ability listing
     * @apiName ability listing
     * @apiGroup Player specialization
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
     *             "id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
     *             "name": "Physical"
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

    router.get("/master/player-specialization/ability/list", checkAuthToken, checkRole(["admin"]), function (req, res) {
        let serviceInst = new PlayerSpecializationService();
        return responseHandler(req, res, serviceInst.getAbilityList());
    });

    /**
     * @api {put} /master/player-specialization/ability/:ability_id edit ability
     * @apiName edit ability
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name ability name
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
	 *       "message": "Ability already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Ability not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.put("/master/player-specialization/ability/:ability_id", checkAuthToken,
        playerSpecializationValidator.AbilityAPIValidation, checkRole(["admin"]), function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.editAbility({ reqObj: req.body, ability_id: req.params.ability_id }));
        });

    /**
     * @api {post} /master/player-specialization/parameter/add add parameter
     * @apiName add parameter
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name parameter name
     * @apiParam (body) {String} ability_id ability id
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
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "Parameter already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Ability not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.post("/master/player-specialization/parameter/add", checkAuthToken, checkRole(["admin"]),
        playerSpecializationValidator.addParameterAPIValidation, function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.addParameter({ reqObj: req.body }));
        });

    /**
     * @api {get} /master/player-specialization/parameter/list/:ability_id parameter listing
     * @apiName parameter listing
     * @apiGroup Player specialization
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
     *             "id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
     *             "name": "Strength"
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

    router.get("/master/player-specialization/parameter/list/:ability_id", function (req, res) {
        let serviceInst = new PlayerSpecializationService();
        return responseHandler(req, res, serviceInst.getParameterList(req.params.ability_id));
    });

    /**
     * @api {put} /master/player-specialization/parameter/:ability_id/:parameter_id edit parameter
     * @apiName edit parameter
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name parameter name
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
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "Parameter already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Ability not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Parameter not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.put("/master/player-specialization/parameter/:ability_id/:parameter_id", checkAuthToken, checkRole(["admin"]),
        playerSpecializationValidator.editParameterAPIValidation, function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.editParameter({
                reqObj: req.body,
                ability_id: req.params.ability_id, parameter_id: req.params.parameter_id
            }));
        });
};