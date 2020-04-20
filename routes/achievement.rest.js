const AchievementService = require('../services/AchievementService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');

module.exports = (router) => {
    /**
 * @api {get} /timeline/achievement/stats achievement stats
 * @apiName achievement stats
 * @apiGroup Achievement 
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
 *                 "achievements":10,
 *                 "tournaments":10
 *               }
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
    router.get('/timeline/achievement/stats', checkAuthToken, function (req, res) {
        let serviceInst = new AchievementService();
        responseHandler(req, res, serviceInst.count(req.authUser.user_id));
    });
}