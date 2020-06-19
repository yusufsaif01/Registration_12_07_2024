
const responseHandler = require("../ResponseHandler");
const { checkAuthToken, checkRole } = require("../middleware/auth");
const ROLE = require("../constants/Role");
const PeopleService = require("../services/PeopleService");

const peopleInst = new PeopleService();

module.exports = (router) => {
  /**
   * @api {get} /master/location/stats location stats
   * @apiName location stats
   * @apiGroup Location
   *
   * @apiSuccess {String} status success
   * @apiSuccess {String} message Successfully done
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "message": "Successfully done",
   *       "data": [ {
   *                  "country": "India",
   *                  "country_id": "3bcda0b2-2bc6-4c0c-bc42-82c4aa42ec39",
   *                  "no_of_state": 10,
   *                  "no_of_city": 10 }
   *               ]
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
  router.get("/people/list", checkAuthToken, function (req, res) {
    return responseHandler(req, res, peopleInst.listAll());
  });
};
