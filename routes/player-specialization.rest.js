const PlayerSpecializationService = require('../services/PlayerSpecializationService');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const playerSpecializationValidator = require("../middleware/validators").playerSpecializationValidator;
const ROLE = require('../constants/Role')

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
        playerSpecializationValidator.AbilityAPIValidation, checkRole([ROLE.ADMIN]), function (req, res) {
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

    router.get("/master/player-specialization/ability/list", checkAuthToken, function (req, res) {
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
        playerSpecializationValidator.AbilityAPIValidation, checkRole([ROLE.ADMIN]), function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.editAbility({ reqObj: req.body, ability_id: req.params.ability_id }));
        });

    /**
     * @api {post} /master/player-specialization/attribute/add add attribute
     * @apiName add attribute
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name attribute name
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
	 *       "message": "Attribute already added",
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

    router.post("/master/player-specialization/attribute/add", checkAuthToken, checkRole([ROLE.ADMIN]),
        playerSpecializationValidator.addAttributeAPIValidation, function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.addAttribute({ reqObj: req.body }));
        });

    /**
     * @api {get} /master/player-specialization/attribute/list/:ability_id attribute listing
     * @apiName attribute listing
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
     *         "ability": "Physical",
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

    router.get("/master/player-specialization/attribute/list/:ability_id", checkAuthToken, checkRole([ROLE.ADMIN]), function (req, res) {
        let serviceInst = new PlayerSpecializationService();
        return responseHandler(req, res, serviceInst.getAttributeList(req.params.ability_id));
    });

    /**
     * @api {put} /master/player-specialization/attribute/:ability_id/:attribute_id edit attribute
     * @apiName edit attribute
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name attribute name
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
	 *       "message": "Attribute already added",
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
     *       "message": "Attribute not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */

    router.put("/master/player-specialization/attribute/:ability_id/:attribute_id", checkAuthToken, checkRole([ROLE.ADMIN]),
        playerSpecializationValidator.editAttributeAPIValidation, function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.editAttribute({
                reqObj: req.body,
                ability_id: req.params.ability_id, attribute_id: req.params.attribute_id
            }));
        });

    /**
     * @api {post} /master/player-specialization/position/add add position
     * @apiName add position
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name position name
     * @apiParam (body) {String} abbreviation abbreviation
     * @apiParam (body) {Array} abilities array of ability_id
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
	 *       "message": "Position already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     */

    router.post("/master/player-specialization/position/add", checkAuthToken,
        playerSpecializationValidator.PositionAPIValidation, checkRole([ROLE.ADMIN]), function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.addPosition({ reqObj: req.body }));
        });

    /**
     * @api {get} /master/player-specialization/position/list position listing
     * @apiName position listing
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
     *         "records": [{
     *                    "id": "1909541a-4b08-48f6-a024-70cbdce73f6e",
     *                    "name": "Goalkeeper",
     *                    "abbreviation": "GK",
     *                    "abilities": [{
     *                       "id": "1e61a8e2-db18-4331-8c5f-d17fa1058eef",
     *                       "name": "Stamina"
     *                         }]
     *                    }]
     *               }
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

    router.get("/master/player-specialization/position/list", checkAuthToken, function (req, res) {
        let serviceInst = new PlayerSpecializationService();
        return responseHandler(req, res, serviceInst.getPositionList());
    });

    /**
     * @api {put} /master/player-specialization/position/:position_id edit position
     * @apiName edit position
     * @apiGroup Player specialization
     *
     * @apiParam (body) {String} name position name
     * @apiParam (body) {String} abbreviation abbreviation
     * @apiParam (body) {Array} abilities array of ability_id
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
	 *       "message": "Position with same name already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }    
     * 
     *  @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "Position with same abbreviation already added",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     */

    router.put("/master/player-specialization/position/:position_id", checkAuthToken,
        playerSpecializationValidator.PositionAPIValidation, checkRole([ROLE.ADMIN]), function (req, res) {
            let serviceInst = new PlayerSpecializationService();
            return responseHandler(req, res, serviceInst.editPosition({ reqObj: req.body, position_id: req.params.position_id }));
        });
};