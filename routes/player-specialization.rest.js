const PlayerSpecializationService = require('../services/PlayerSpecializationService');
const { checkAuthToken } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');

module.exports = (router) => {
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
    router.get("/master/player-specialization/attribute/list/:ability_id", checkAuthToken, function (req, res) {
        let serviceInst = new PlayerSpecializationService();
        return responseHandler(req, res, serviceInst.getAttributeList(req.params.ability_id));
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
};