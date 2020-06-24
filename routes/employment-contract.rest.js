const responseHandler = require("../ResponseHandler");
const { checkAuthToken, checkRole } = require("../middleware/auth");
const ROLE = require("../constants/Role");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const EmploymentContractService = require("../services/EmploymentContractService");
const employmentContractValidator = require("../middleware/validators").employmentContractValidator;

module.exports = (router) => {
  router.get("/employment-contract/list", (req, res, next) => { });

  /**
   * @api {get} /employment-contract/:id Get Employment Contract
   * @apiName Get Employment Contract
   * @apiGroup Employment Contract
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
   *                   "sent_by": "f5967a91-f632-406c-8b5f-0f387453e74d",
   *                   "send_to": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
   *                   "id": "d41d5897-42db-4b0f-aab0-10b08b9b6b09",
   *                   "signingDate": "2020-05-12T00:00:00.000Z",
   *                   "effectiveDate": "2020-05-12T00:00:00.000Z",
   *                   "expiryDate": "2021-05-12T00:00:00.000Z",
   *                   "status": "pending",
   *                   "playerName": "xyz",
   *                   "category": "club",
   *                   "clubAcademyName": "xyz",
   *                   "placeOfSignature": "xyz",
   *                   "clubAcademyRepresentativeName": "xyz",
   *                   "clubAcademyAddress": "xyz",
   *                   "clubAcademyPhoneNumber": "0987654321",
   *                   "clubAcademyEmail": "newclub@newclub.com",
   *                   "aiffNumber": "1234567890",
   *                   "crsUserName": "xyz",
   *                   "legalGuardianName": "xyz",
   *                   "playerAddress": "xyz",
   *                   "playerMobileNumber": "0987654321",
   *                   "playerEmail": "player38@player.com",
   *                   "clubAcademyUsesAgentServices": true,
   *                   "clubAcademyIntermediaryName": "xyz",
   *                   "clubAcademyTransferFee": "8970",
   *                   "playerUsesAgentServices": true,
   *                   "playerIntermediaryName": "xyz",
   *                   "playerTransferFee": "8970",
   *                   "created_by": "player"
   *                  }
   *      }
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
   *       "message": "Employment contract not found",
   *       "code": "NOT_FOUND",
   *       "httpCode": 404
   *     }
   * 
   * @apiErrorExample {json} VALIDATION_FAILED
	 *     HTTP/1.1 422 Validiation Failed
	 *     {
	 *       "message": "Not allowed to view employment contract",
   *       "code": "VALIDATION_FAILED",
   *       "httpCode": 422
	 *     }   
   *  
   */
  router.get("/employment-contract/:id", checkAuthToken, (req, res, next) => {
    let serviceInst = new EmploymentContractService();
    responseHandler(req, res, serviceInst.getEmploymentContractDetails({ id: req.params.id, user: req.authUser }));
  });
  router.post("/employment-contract", (req, res, next) => { });
  router.delete("/employment-contract/:id", (req, res, next) => { });
  /**
   * @api {put} /employment-contract/:id/status Update Employment Contract Status
   * @apiName Update Employment Contract Status
   * @apiGroup Employment Contract
   * 
   * @apiParam (body) {string} status Status enum : approved, disapproved
   * @apiParam (body) {string} [remarks] Status remarks (required if status = disapproved)
   * 
   * @apiSuccess {String} status success
   * @apiSuccess {String} message Successfully done
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *          "status": "success",
   *          "message": "Successfully done"
   *      }
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
  router.put("/employment-contract/:id/status", checkAuthToken, employmentContractValidator.UpdateStatusValidator, (req, res, next) => {
    let serviceInst = new EmploymentContractService();
    responseHandler(req, res, serviceInst.updateEmploymentContractStatus({ id: req.params.id, user: req.authUser, reqObj: req.body }));
  });
};
