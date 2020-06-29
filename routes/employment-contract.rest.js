const responseHandler = require("../ResponseHandler");
const { checkAuthToken, checkRole } = require("../middleware/auth");
const ROLE = require("../constants/Role");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const EmploymentContractService = require("../services/EmploymentContractService");
const employmentContractValidator = require("../middleware/validators/employmentContractValidator");

const contractService = new EmploymentContractService();

module.exports = (router) => {
  /**
   * @api {get} /employment-contract/list Get Employment Contract List
   * @apiName Get Employment Contract List
   * @apiGroup Employment Contract
   * 
   * @apiParam (query) {String} page_no page number
   * @apiParam (query) {String} page_size records per page
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
   *                   "total": 1,
   *                    "records": [{
   *                         "id": "d41d5897-42db-4b0f-aab0-10b08b9b6b09",
   *                         "effectiveDate": "2020-05-23T00:00:00.000Z",
   *                         "expiryDate": "2021-06-12T00:00:00.000Z",
   *                         "status": "active",
   *                         "name": "newclub",
   *                         "avatar": "\\uploads\\documents\\sampleHouse1590487315578.png",
   *                         "clubAcademyUserId": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
   *                         "created_by": "player",
   *                         "canUpdateStatus": true
   *                                }]
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
   */
  router.get("/employment-contract/list", checkAuthToken, (req, res, next) => {
    let paginationOptions = {
      page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
      limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
    };
    let user_id = req.authUser.user_id;
    responseHandler(req, res, contractService.getEmploymentContractList({ user_id: user_id, role: req.authUser.role, paginationOptions }));
  });
  
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
    responseHandler(req, res, contractService.getEmploymentContractDetails({ id: req.params.id, user: req.authUser }));
  });

  /**
   * @api {post} /employment-contract Add Employment Contract
   * @apiName Add Employment Contract
   * @apiGroup Employment Contract
   *
   * @apiParam (body) {String} playerName Player Name
   * @apiParam (body) {String} category Category/role of player
   * @apiParam (body) {String} clubAcademyName Club academy Name
   * @apiParam (body) {Date} signingDate Signing Date, any past date
   * @apiParam (body) {Date} effectiveDate Past of future day but should be grater than signingDate
   * @apiParam (body) {Date} expiryDate Expiry Date, max date is effectiveDate + 5yrs
   * @apiParam (body) {String} placeOfSignature Place of signature
   * @apiParam (body) {String} clubAcademyRepresentativeName Club academy representative name.
   * @apiParam (body) {String} clubAcademyAddress Club academy address
   * @apiParam (body) {String} clubAcademyPhoneNumber club academy phone number
   * @apiParam (body) {String} clubAcademyEmail club academy email
   * @apiParam (body) {String} aiffNumber AIFF number
   * @apiParam (body) {String} crsUserName CRS user name
   * @apiParam (body) {String} legalGuardianName Legal guardian name
   * @apiParam (body) {String} playerAddress Player address
   * @apiParam (body) {String} playerMobileNumber Player mobile number
   * @apiParam (body) {Email} playerEmail Player email
   * @apiParam (body) {Boolean} clubAcademyUsesAgentServices Club uses academy services
   * @apiParam (body) {String} clubAcademyIntermediaryName Club academy intermediary name
   * @apiParam (body) {String} clubAcademyTransferFee Club transfer fees
   * @apiParam (body) {Boolean} playerUsesAgentServices Player uses agent service
   * @apiParam (body) {String} playerIntermediaryName Player intermediary name
   * @apiParam (body) {String} playerTransferFee Player transfer fees
   * @apiParam (body) {String} [otherName]  Other name, required when clubAcademyName is 'others'
   * @apiParam (body) {String} [otherEmail] Other Email required when clubAcademyName is 'others'
   * @apiParam (body) {String} [otherPhoneNumber] Other phone required when clubAcademyName is 'others'
   *
   * @apiParamExample {json} Request-Example:
   * {
   *   "playerName": "Someone",
   *   "category": "club",
   *   "clubAcademyName": "SomeClub",
   *   "signingDate": "2020-06-15",
   *   "effectiveDate": "2020-06-20",
   *   "expiryDate": "2023-06-20",
   *   "placeOfSignature": "General Office",
   *   "clubAcademyRepresentativeName": "Gopal",
   *   "clubAcademyAddress": "Near that road",
   *   "clubAcademyPhoneNumber": "9898955662",
   *   "clubAcademyEmail": "useless@club.com",
   *   "aiffNumber": "asdas21312",
   *   "crsUserName": "CSRF_NAME",
   *   "legalGuardianName": "Gopal's Father",
   *   "playerAddress": "near other road",
   *   "playerMobileNumber": "123132155464",
   *   "playerEmail": "player@localhost.com",
   *   "clubAcademyUsesAgentServices": true,
   *   "clubAcademyIntermediaryName": "sdas",
   *   "clubAcademyTransferFee": "asdahy",
   *   "playerUsesAgentServices": true,
   *   "playerIntermediaryName": "some check",
   *   "playerTransferFee": "transfer fee",
   *   "otherName": "Some other club",
   *   "otherEmail": "someotheremail@localhost.com",
   *   "otherPhoneNumber": "2342883888"
   * }
   *
   * @apiSuccess {String} status success
   * @apiSuccess {String} message Successfully done
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "status": "success",
   *    "message": "Successfully done"
   * }
   *
   * @apiErrorExample {json} Already active Contract
   * HTTP/1.1 400 Bad Request
   * {
   *      "message": "Player already have an active contract",
   *      "code": "BAD_REQUEST",
   *      "httpCode": 400
   * }
   * @apiErrorExample {json} Duplicate Contract
   * HTTP/1.1 400 Bad Request
   * {
   *      "message": "Contract already exists",
   *      "code": "BAD_REQUEST",
   *      "httpCode": 400
   * }
   *
   */
  router.post(
    "/employment-contract",
    checkAuthToken,
    employmentContractValidator.createValidator,
    (req, res, next) => {
      let body = req.body;

      return responseHandler(
        req,
        res,
        contractService.createContract(body, req.authUser)
      );
    }
  );

  /**
   * @api {PUT} /employment-contract/:id Update Employment Contract
   * @apiName Update Employment Contract
   * @apiGroup Employment Contract
   *
   * @apiParam (body) {String} playerName Player Name
   * @apiParam (body) {String} category Category/role of player
   * @apiParam (body) {String} clubAcademyName Club academy Name
   * @apiParam (body) {Date} signingDate Signing Date, any past date
   * @apiParam (body) {Date} effectiveDate Past of future day but should be grater than signingDate
   * @apiParam (body) {Date} expiryDate Expiry Date, max date is effectiveDate + 5yrs
   * @apiParam (body) {String} placeOfSignature Place of signature
   * @apiParam (body) {String} clubAcademyRepresentativeName Club academy representative name.
   * @apiParam (body) {String} clubAcademyAddress Club academy address
   * @apiParam (body) {String} clubAcademyPhoneNumber club academy phone number
   * @apiParam (body) {String} clubAcademyEmail club academy email
   * @apiParam (body) {String} aiffNumber AIFF number
   * @apiParam (body) {String} crsUserName CRS user name
   * @apiParam (body) {String} legalGuardianName Legal guardian name
   * @apiParam (body) {String} playerAddress Player address
   * @apiParam (body) {String} playerMobileNumber Player mobile number
   * @apiParam (body) {Email} playerEmail Player email
   * @apiParam (body) {Boolean} clubAcademyUsesAgentServices Club uses academy services
   * @apiParam (body) {String} clubAcademyIntermediaryName Club academy intermediary name
   * @apiParam (body) {String} clubAcademyTransferFee Club transfer fees
   * @apiParam (body) {Boolean} playerUsesAgentServices Player uses agent service
   * @apiParam (body) {String} playerIntermediaryName Player intermediary name
   * @apiParam (body) {String} playerTransferFee Player transfer fees
   * @apiParam (body) {String} [otherName]  Other name, required when clubAcademyName is 'others'
   * @apiParam (body) {String} [otherEmail] Other Email required when clubAcademyName is 'others'
   * @apiParam (body) {String} [otherPhoneNumber] Other phone required when clubAcademyName is 'others'
   *
   * @apiParamExample {json} Request-Example:
   * {
   *   "playerName": "Someone",
   *   "category": "club",
   *   "clubAcademyName": "SomeClub",
   *   "signingDate": "2020-06-15",
   *   "effectiveDate": "2020-06-20",
   *   "expiryDate": "2023-06-20",
   *   "placeOfSignature": "General Office",
   *   "clubAcademyRepresentativeName": "Gopal",
   *   "clubAcademyAddress": "Near that road",
   *   "clubAcademyPhoneNumber": "9898955662",
   *   "clubAcademyEmail": "useless@club.com",
   *   "aiffNumber": "asdas21312",
   *   "crsUserName": "CSRF_NAME",
   *   "legalGuardianName": "Gopal's Father",
   *   "playerAddress": "near other road",
   *   "playerMobileNumber": "123132155464",
   *   "playerEmail": "player@localhost.com",
   *   "clubAcademyUsesAgentServices": true,
   *   "clubAcademyIntermediaryName": "sdas",
   *   "clubAcademyTransferFee": "asdahy",
   *   "playerUsesAgentServices": true,
   *   "playerIntermediaryName": "some check",
   *   "playerTransferFee": "transfer fee",
   *   "otherName": "Some other club",
   *   "otherEmail": "someotheremail@localhost.com",
   *   "otherPhoneNumber": "2342883888"
   * }
   *
   * @apiSuccess {String} status success
   * @apiSuccess {String} message Successfully done
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "status": "success",
   *    "message": "Successfully done"
   * }
   *
   * @apiErrorExample {json} Not Found:
   * HTTP/1.1 404 Not Found
   * {
   *      "message": "Not Found",
   *      "code": "NOT_FOUND",
   *      "httpCode": 404
   * }
   *
   * @apiErrorExample {json} Contract Already Approved:
   * HTTP/1.1 401 Unauthorized
   * {
   *      "message": "Cannot update already approved contract.",
   *      "code": "UNAUTHORIZED",
   *      "httpCode": 401
   * }
   *
   *
   *
   */
  router.put(
    "/employment-contract/:id",
    checkAuthToken,
    employmentContractValidator.createValidator,
    (req, res, next) => {
      let body = req.body;

      return responseHandler(
        req,
        res,
        contractService.updateContract(req.params.id, body, req.authUser)
      );
    }
  );

  /**
   * @api {DELETE} /employment-contract/:id Delete Employment Contract
   * @apiName Delete Employment Contract
   * @apiGroup Employment Contract
   *
   * @apiSuccessExample {json} Success Response:
   * {
   *    "status": "success",
   *    "message": "Successfully done"
   * }
   *
   * @apiErrorExample {json} Not Found:
   * HTTP/1.1 404 Not Found
   * {
   *      "message": "Not Found",
   *      "code": "NOT_FOUND",
   *      "httpCode": 404
   * }
   *
   */

  router.delete(
    "/employment-contract/:id",
    checkAuthToken,
    (req, res, next) => {
      return responseHandler(
        req,
        res,
        contractService.deleteContract(req.params.id, req.authUser)
      );
    }
  );
  
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
