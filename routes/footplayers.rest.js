const { checkAuthToken } = require("../middleware/auth");
const responseHandler = require("../ResponseHandler");
const FootPlayerService = require("../services/FootPlayerService");
const ClubFootPlayersResponseMapping = require("../dataModels/responseMapper/ClubFootPlayersResponseMapping");


const footPlayerInst = new FootPlayerService;
const dataMapping = new ClubFootPlayersResponseMapping;


module.exports = (router) => {
  
  /**
    * @api {get} /footplayers Club'f footplayers
    * @apiName Club foot players
    * @apiGroup Club Foor Players
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
    
    let filters = {
      search: req.query.search,
      page_no: req.query.page_no || 1,
      page_size: req.query.page_size || 10,
    };

    let criteria = {
      sentBy: req.authUser.user_id
    }

    const params = {
      filters,
      criteria
    }

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

  });
};
