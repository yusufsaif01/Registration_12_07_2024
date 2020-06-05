const { checkAuthToken } = require("../middleware/auth");
const responseHandler = require("../ResponseHandler");
const FootPlayerService = require("../services/FootPlayerService");
const ClubFootPlayersResponseMapping = require("../dataModels/responseMapper/ClubFootPlayersResponseMapping");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");


const footPlayerInst = new FootPlayerService();
const dataMapping = new ClubFootPlayersResponseMapping();


module.exports = (router) => {
  
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
