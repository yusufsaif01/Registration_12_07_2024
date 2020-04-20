const AchievementService = require('../services/AchievementService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');
const FileService = require('../services/FileService');
const userValidator = require("../middleware/validators").userValidator;

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
        responseHandler(req, res, serviceInst.stats(req.authUser.user_id));
    });

    /**
 * @api {get} /achievement/list?page_no=1&page_size=20 achievement listing
 * @apiName achievement listing
 * @apiGroup Achievement
 *
 * @apiParam (query) {String} page_no page number.
 * @apiParam (query) {String} page_size records per page
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
 *         "records":[
 *           {
 *             "type":"Individual awards",
 *             "name": "Devdar trophy",
 *             "year": "1989",
 *             "position": "First",
 *             "image": "\\uploads\\documents\\Sample.jpg",
 *             "id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996"
 *           }
 *         ]
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

    router.get('/achievement/list', checkAuthToken, function (req, res) {
        let paginationOptions = {};
        let sortOptions = {};

        paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };
        sortOptions = {
            sort_by: "year",
            sort_order: "1"
        };

        let serviceInst = new AchievementService();
        responseHandler(req, res, serviceInst.getList({
            paginationOptions, sortOptions, user_id: req.authUser.user_id
        }));
    });
    /**
 * @api {post} /achievement/add add achievements
 * @apiName add achievements
 * @apiGroup Achievement
 *   
 * @apiParam (body) {String} type type of achievement
 * @apiParam (body) {String} name name of achievement
 * @apiParam (body) {String} year year of achievement
 * @apiParam (body) {String} position position achieved
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
 * @apiErrorExample {json} Unauthorized
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized",
 *       "code": "UNAUTHORIZED",
 *       "httpCode": 401
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
    router.post('/achievement/add', checkAuthToken, userValidator.addAchievementAPIValidation, async function (req, res) {
        let reqObj = req.body
        try {
            if (req.files) {
                const _fileInst = new FileService();
                if (req.files.achievement) {
                    let media_url = await _fileInst.uploadFile(req.files.achievement, "./documents/", req.files.achievement);
                    reqObj.media_url = media_url;
                }
            }
            let serviceInst = new AchievementService();
            responseHandler(req, res, serviceInst.add({
                reqObj: reqObj,
                user_id: req.authUser.user_id
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });
     /**
 * @api {put} /achievement/:id edit achievements
 * @apiName edit achievements
 * @apiGroup Achievement
 *   
 * @apiParam (body) {String} type type of achievement
 * @apiParam (body) {String} name name of achievement
 * @apiParam (body) {String} year year of achievement
 * @apiParam (body) {String} position position achieved
 * 
 * @apiSuccess {String} status success
 * @apiSuccess {String} message Successfully done
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "message": "Successfully done",
 *       "data": {"n": 1,
 *                "nModified": 1,
 *                "ok": 1}
 *     }   
 * 
 * @apiErrorExample {json} Unauthorized
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized",
 *       "code": "UNAUTHORIZED",
 *       "httpCode": 401
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
 * @apiErrorExample {json} NOT_FOUND
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "Achievement not found",
 *       "code": "NOT_FOUND",
 *       "httpCode": 404
 *     }
 * 
 */
        router.put('/achievement/:id', checkAuthToken, userValidator.addAchievementAPIValidation, async function (req, res) {
            let reqObj = req.body
            try {
                if (req.files) {
                    const _fileInst = new FileService();
                    if (req.files.achievement) {
                        let media_url = await _fileInst.uploadFile(req.files.achievement, "./documents/", req.files.achievement);
                        reqObj.media_url = media_url;
                    }
                }
                let serviceInst = new AchievementService();
                responseHandler(req, res, serviceInst.edit({
                    reqObj: reqObj,
                    id: req.params.id,
                    user_id: req.authUser.user_id
                }));
            } catch (e) {
                console.log(e);
                responseHandler(req, res, Promise.reject(e));
            }
        });

}