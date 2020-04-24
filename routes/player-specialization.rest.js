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

    router.get("/master/player-specialization/ability/list", function (req, res) {
        let serviceInst = new PlayerSpecializationService();
        return responseHandler(req, res, serviceInst.getAbilityList());
    });
};