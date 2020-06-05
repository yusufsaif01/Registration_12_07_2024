const { checkAuthToken } = require("../middleware/auth");
const responseHandler = require("../ResponseHandler");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const PlayerDocumentsService = require("../services/PlayerDocumentsService");
const PlayerDocumentsResponseMapper = require("../dataModels/responseMapper/PlayerDocumentsResponseMapper");
const updateStatusValidator = require("../middleware/validators/member-documents/updateStatusValidator");
const auth = require("../middleware/auth");
const Role = require("../constants/Role");

const playerDocInst = new PlayerDocumentsService();

module.exports = (router) => {

  /**
    * @api {get} /player/:user_id/documents Get player documents listing
    * @apiName Player documents listing
    * @apiGroup Player Documents
    * 
    * @apiSuccess {String} status success
    * @apiSuccess {String} message Successfully done
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "status": "success",
    *       "message": "successfully done",
    *       "data": {
    *         "player_name": "",
    *         "date_of_birth": "",
    *         "documents": [
    *           {
    *             "type": "aadhar",
    *             "added_on": "",
    *             "document_number": "",
    *             "media": {
    *               "attachment_type": "image",
    *               "doc_front": "",
    *               "doc_back": "",
    *               "user_photo": "",
    *               "document": ""
    *             },
    *             "status": "pending"
    *           }
    *         ]
    *       }
    *     }
    *
    * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
    *     HTTP/1.1 500 Internal server error
    *     {
    *       "message": "Internal Server Error",
    *       "code": "INTERNAL_SERVER_ERROR",
    *       "httpCode": 500
    *     }
    * @apiErrorExample {object} NOT_FOUND
    * HTTP/1.1 404 Not Found
    * {
    *      "message": "User not found",
    *      "code": "NOT_FOUND",
    *      "httpCode": 404
    *  }
    * 
    */
  router.get(
    "/player/:user_id/documents",
    checkAuthToken,
    auth.checkRole([Role.ADMIN]),
    async (req, res) => {
      let { user_id } = req.params;

      try {
        responseHandler(
          req,
          res,
          Promise.resolve(
            PlayerDocumentsResponseMapper.map(
              await playerDocInst.getUserDocuments(user_id)
            )
          )
        );
      } catch (e) {
        responseHandler(req,res, Promise.reject(e));
      }
    }
  );

  /**
   * @api {put} /player/:user_id/documents/status Update player document status
   * @apiName Player documents update status
   * @apiGroup Player Documents
   * 
   * @apiParam (body) {string} status Status enum : pending, approved, disapproved (Required)
   * @apiParam (body) {string} remarks Status remarks
   * @apiParam (body) {string} type Type of the document for which the status needs to be updated.(Required)
   * 
   * @apiSuccess {String} status success
   * @apiSuccess {String} message Successfully done
   * 
   * @apiSuccessExample {object} Success-Response:
   * {
   *     "status": "success",
   *     "message": "Successfully done"
   * }
   * 
   * @apiErrorExample {object} NOT_FOUND
   *  HTTP/1.1 404 Not Found
   *  {
   *      "message": "User not found",
   *      "code": "NOT_FOUND",
   *      "httpCode": 404
   *  }
   * @apiErrorExample {object} VALIDATION_FAILED
   *  HTTP/1.1 422 Unprocessable Entity
   *  {
   *       "message": "\"remarks\" is required",
   *       "code": "VALIDATION_FAILED",
   *       "httpCode": 422
   *   }
   * 
   */
  router.put(
    "/player/:user_id/documents/status",
    checkAuthToken,
    auth.checkRole([Role.ADMIN]),
    updateStatusValidator.addUpdateStatusValidator,
    async (req, res) => {
      let { user_id } = req.params;

      let { status, remarks, type } = req.body;

      try {
        responseHandler(
          req,
          res,
          Promise.resolve(
            playerDocInst.updateDocumentStatus(user_id, type, status, remarks)
          )
        );
      } catch (error) {
        responseHandler(req,res, Promise.reject(e))
      };
    }
  );
};
