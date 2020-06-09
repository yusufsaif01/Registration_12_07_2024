const FootPlayerService = require('../services/FootPlayerService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const footplayerValidator = require("../middleware/validators").footplayerValidator;
const ROLE = require('../constants/Role')
// merging from 719
const ClubFootPlayersResponseMapping = require("../dataModels/responseMapper/ClubFootPlayersResponseMapping");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const footPlayerInst = new FootPlayerService();
const dataMapping = new ClubFootPlayersResponseMapping();


module.exports = (router) => {

    /**
     * @api {get} /footplayer/search?name=<name>&email=<email>&phone=<phone> find player
     * @apiName find player
     * @apiGroup Footplayer
     * 
	 * @apiParam (query) {String} name name
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
            name: (req.query && req.query.name) ? req.query.name : null,
            email: (req.query && req.query.email) ? req.query.email : null,
            phone: (req.query && req.query.phone) ? req.query.phone : null,
        }
        let serviceInst = new FootPlayerService();
        return responseHandler(req, res, serviceInst.footplayerSearch({ filterConditions, user_id: req.authUser.user_id }));
    });

    /**
     * @api {post} /footplayer/request send footplayer request
     * @apiName send footplayer request
     * @apiGroup Footplayer
     *   
     * @apiParam (body) {String} to user_id of the user to whom request will be send
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
     * @apiErrorExample {json} VALIDATION_FAILED
	 *     HTTP/1.1 422 Validiation Failed
	 *     {
	 *       "message": "Player is not verified",
     *       "code": "VALIDATION_FAILED",
     *       "httpCode": 422
	 *     }  
     * 
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "Already footplayer",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "Footplayer request already sent",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     */

    router.post('/footplayer/request', checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]), footplayerValidator.footplayerRequestAPIValidation, function (req, res) {
        let serviceInst = new FootPlayerService();
        responseHandler(req, res, serviceInst.sendFootplayerRequest({ sent_by: req.authUser.user_id, send_to: req.body.to, member_type: req.authUser.member_type }));
    });

    /**
     * @api {get} /footplayer/requests?requested_by=<club>&page_no=1&page_size=10 footplayer request list
     * @apiName footplayer request list
     * @apiGroup Footplayer
     * 
     * @apiParam (query) {String} requested_by requested_by can be club or academy 
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
     *         "records":[{
     *             "request_id": "78ea72a6-d749-40f2-b4c1-f14737d10204"
     *             "user_id": "f9cdd4d4-fe2d-4166-9685-6638fa80e526",
     *             "avatar": "/uploads/avatar/user-avatar.png",
     *             "name": "xyz",
     *             "member_type": "club",
     *             "sub_category": "Residential",
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

    router.get("/footplayer/requests", checkAuthToken, checkRole([ROLE.PLAYER]), footplayerValidator.footplayerRequestListValidation, function (req, res) {
        let paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        };
        let filterConditions = {
            requested_by: (req.query && req.query.requested_by) ? req.query.requested_by : null,
        }
        let serviceInst = new FootPlayerService();
        return responseHandler(req, res, serviceInst.getFootplayerRequestList({ paginationOptions, filterConditions, user_id: req.authUser.user_id }));
    });

    /**
     * @api {patch} /footplayer/request/accept/:sent_by accept footplayer request
     * @apiName accept footplayer request
     * @apiGroup Footplayer
     *   
     * @apiParam (params) {String} sent_by user_id of sent_by
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
    router.patch('/footplayer/request/accept/:sent_by', checkAuthToken, function (req, res) {
        let serviceInst = new FootPlayerService();
        responseHandler(req, res, serviceInst.acceptFootplayerRequest({ user_id: req.authUser.user_id, sent_by: req.params.sent_by }));
    });

    /**
     * @api {patch} /footplayer/request/reject/:sent_by reject footplayer request
     * @apiName reject footplayer request
     * @apiGroup Footplayer
     *   
     * @apiParam (params) {String} sent_by user_id of sent_by
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
    router.patch('/footplayer/request/reject/:sent_by', checkAuthToken, function (req, res) {
        let serviceInst = new FootPlayerService();
        responseHandler(req, res, serviceInst.rejectFootplayerRequest({ user_id: req.authUser.user_id, sent_by: req.params.sent_by }));
    });

    /**
     * @api {post} /footplayer/invite send footplayer invite
     * @apiName send footplayer invite
     * @apiGroup Footplayer
     *   
     * @apiParam (body) {String} [name] name
     * @apiParam (body) {String} [phone] phone number 
     * @apiParam (body) {String} email email
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
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "Invite already sent",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     *      
     * @apiErrorExample {json} CONFLICT
	 *     HTTP/1.1 409 Conflict
	 *     {
	 *       "message": "Email is already registered",
     *       "code": "CONFLICT",
     *       "httpCode": 409
	 *     }
     * 
     */
    router.post('/footplayer/invite', checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]), footplayerValidator.footplayerInviteValidation, function (req, res) {
        let serviceInst = new FootPlayerService();
        responseHandler(req, res, serviceInst.sendFootplayerInvite({ sent_by: req.authUser.user_id, send_to: req.body }));
    });
    
    /**
     * @api {post} /footplayer/resend-invite resend footplayer invite
     * @apiName resend footplayer invite
     * @apiGroup Footplayer
     *   
     * @apiParam (body) {String} [phone] phone number 
     * @apiParam (body) {String} email email
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
     * @apiErrorExample {json} NOT_FOUND
     *     HTTP/1.1 404 Not found
     *     {
     *       "message": "Invite not found",
     *       "code": "NOT_FOUND",
     *       "httpCode": 404
     *     }
     * 
     */
    router.post('/footplayer/resend-invite', checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]), footplayerValidator.resendFootplayerInviteValidation, function (req, res) {
        let serviceInst = new FootPlayerService();
        responseHandler(req, res, serviceInst.resendFootplayerInvite({ sent_by: req.authUser.user_id, send_to: req.body }));
    });

    // merging routes from 719
    
    /**
    * @api {get} /footplayers Club/Academy footplayers
    * @apiName Club/Academy footplayers list
    * @apiGroup Club/Academy FootPlayers
    * 
    * @apiParam (query) {String} search Search query.
    * @apiParam (query) {String} page_no page number.
    * @apiParam (query) {String} page_size page size.
    * 
    * @apiSuccess {String} status success
    * @apiSuccess {String} message Successfully done
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *          "status": "success",
    *          "message": "Successfully done",
    *          "data": {
    *              "total": 3,
    *              "records": [
    *                  {
    *                      "id": "d41d5897-42db-4b0f-aab0-10b08b9b6b09",
    *                      "user_id": "9e770dd5-629d-4d73-9e53-ad4b798a201e",
    *                      "avatar": "/uploads/avatar/user-avatar.png",
    *                      "category": "grassroot",
    *                      "name": "Rajesh Kumar",
    *                      "position": "Centre Attacking Midfielder",
    *                      "status": "pending"
    *                  },
    *              ]
    *          }
    *      }
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
  router.get("/footplayers", checkAuthToken, async (req, res, next) => {
    
    try {
      let filters = {
        search: req.query.search,
        page_no: Number(req.query.page_no) || 1,
        page_size: Number(req.query.page_size) || 10,
      };

      let criteria = {
        sentBy: req.authUser.user_id,
      };

      const params = {
        filters,
        criteria,
      };

      let records = await footPlayerInst.listAll(params);
      let totalCount = await footPlayerInst.countDocs(params);

      responseHandler(
        req,
        res,
        Promise.resolve({
          total: totalCount,
          records: dataMapping.map(records),
        })
      );
    } catch (error) {
      console.log(error);
      responseHandler(req,res, Promise.reject(error));
    }

  });

  /**
   * @api {delete} /footplayers/:id delete footplayer request
   * @apiName Club/Academy foot players delete
   * @apiGroup Club/Academy Foot Players
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
   * @apiErrorExample {json} UNAUTHORIZED
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "Unauthorized",
   *       "code": "UNAUTHORIZED",
   *       "httpCode": 401
   *     }
   * 
   * @apiErrorExample {json} NOT_FOUND
   *     HTTP/1.1 404 Not found
   *     {
   *       "message": "Footmate request not found",
   *       "code": "NOT_FOUND",
   *       "httpCode": 404
   *     }
   * 
   */
  router.delete("/footplayers/:id", checkAuthToken, async (req,res,next) => {
    try {
      if (!req.params.id) {
        return Promise.reject(
          new errors.ValidationFailed(RESPONSE_MESSAGE.USER_ID_REQUIRED)
        );
      }
      let requestId = req.params.id;
      
      responseHandler(req, res, footPlayerInst.deleteRequest(requestId,req.authUser.user_id));
    } catch (e) {
      console.log(e);
      responseHandler(req, res, Promise.reject(e));
    }
  });
};