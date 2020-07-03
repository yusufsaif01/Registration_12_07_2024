const responseHandler = require("../ResponseHandler");
const { checkAuthToken, checkRole } = require("../middleware/auth");
const ROLE = require("../constants/Role");
const PeopleService = require("../services/PeopleService");
const PeopleListResponseMapper = require("../dataModels/responseMapper/PeopleListResponseMapper");

const peopleInst = new PeopleService();

module.exports = (router) => {
  /**
   * @api {get} /people/list People Lists
   * @apiName People Lists
   * @apiGroup People
   * 
   * @apiParam (query) {String} role Role to filter records [club, academy] 
   *
   * @apiSuccess {String} status success
   * @apiSuccess {String} message Successfully done
   * @apiSuccess {Array} People records
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "message": "Successfully done",
   *       "data": [
   *        {
              "user_id": "3feafdc2-a34b-4cfb-8b25-909f06e54b4b",
              "name": "club1",
              "email": "club1@gmail.com"
            }
   *      ]
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
  router.get("/people/list", checkAuthToken, async function (req, res) {
    let params = req.query;

    try {
      return responseHandler(
        req,
        res,
        Promise.resolve(
          new PeopleListResponseMapper().map(await peopleInst.listAll(params))
        )
      );
    } catch (error) {
      console.log(error);
      responseHandler(req, res, Promise.reject(error));
    }
  });

  /**
   * @api {get} /people/:id Player Details
   * @apiName Player Details
   * @apiGroup People
   * 
   * 
   * @apiSuccess {String} status success
   * @apiSuccess {String} message Successfully done
   * @apiSuccess {Object} Player record
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "message": "Successfully done",
   *       "data": [
   *          {
   *           "user_id": "704132f1-ddfc-4e82-95d0-d5fb3851fa41",
   *           "email": "play31@gmail.com",
   *           "address": "",
   *           "mobile": "",
   *           "age": 21
   *         }
   *      ]
   *     }
   *
   * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
   *     HTTP/1.1 500 Internal server error
   *     {
   *       "message": "Internal Server Error",
   *       "code": "INTERNAL_SERVER_ERROR",
   *       "httpCode": 500
   *     }
   * @apiErrorExample {json} NOT_FOUND:
   * HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found",
   *       "code": "NOT_FOUND",
   *       "httpCode": 404
   *   }
   */
  router.get("/people/:id", checkAuthToken, async function (req, res) {
    let { id } = req.params;

    try {
      return responseHandler(
        req,
        res,
        Promise.resolve(
          new PeopleListResponseMapper().mapOne(await peopleInst.getOne(id))
        )
      );
    } catch (error) {
      console.log(error);
      responseHandler(req, res, Promise.reject(error));
    }
  });
};
