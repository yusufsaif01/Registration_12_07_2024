const FootPlayerService = require('../services/FootPlayerService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const footplayerValidator = require("../middleware/validators").footplayerValidator;
const ROLE = require('../constants/Role')

module.exports = (router) => {

    /**
     * @api {get} /footplayer/search?first_name=<first_name>&last_name=<last_name>&email=<email>&phone=<phone> find player
     * @apiName find player
     * @apiGroup Footplayer
     * 
     * @apiParam (query) {String} first_name first name
	 * @apiParam (query) {String} last_name last name
     * @apiParam (query) {String} email email
     * @apiParam (query) {String} phone phone number
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
     *         "records":[{
     *             "user_id": "f9cdd4d4-fe2d-4166-9685-6638fa80e526",
     *             "avatar": "number of players associated",
     *             "name": "/uploads/avatar/user-avatar.png",
     *             "member_type": "player",
     *             "category": "professional",
     *             "position": "Goalkeeper",
     *             "member_type": "player",
     *             "is_verified": true,
     *             "club_name": "xyz club"
     *            }] }
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

    router.get("/footplayer/search", checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]), footplayerValidator.footplayerSearchQueryValidation, function (req, res) {
        filterConditions = {
            first_name: (req.query && req.query.first_name) ? req.query.first_name : null,
            last_name: (req.query && req.query.last_name) ? req.query.last_name : null,
            email: (req.query && req.query.email) ? req.query.email : null,
            phone: (req.query && req.query.phone) ? req.query.phone : null,
        }
        let serviceInst = new FootPlayerService();
        return responseHandler(req, res, serviceInst.footplayerSearch({ filterConditions, user_id: req.authUser.user_id }));
    });
};