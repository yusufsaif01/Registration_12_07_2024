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
   *                         "effective_date": "2020-05-23T00:00:00.000Z",
   *                         "expiry_date": "2021-06-12T00:00:00.000Z",
   *                         "status": "active",
   *                         "name": "newclub",
   *                         "avatar": "\\uploads\\documents\\sampleHouse1590487315578.png",
   *                         "club_academy_user_id": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
   *                         "created_by": "player",
   *                         "can_update_status": true
   *                       }]
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
   *                   "club_academy_uses_agent_services": true,
   *                   "player_uses_agent_services": false,
   *                   "is_deleted": false,
   *                   "player_name": "Someone",
   *                   "club_academy_name": "Others",
   *                   "signing_date": "2020-06-15T00:00:00.000Z",
   *                   "effective_date": "2020-06-20T00:00:00.000Z",
   *                   "expiry_date": "2023-06-20T00:00:00.000Z",
   *                   "place_of_signature": "General Office",
   *                   "player_mobile_number": "7989875642",
   *                   "club_academy_representative_name": "Gopal",
   *                   "club_academy_address": "Near that road",
   *                   "club_academy_phone_number": "9898955662",
   *                   "club_academy_email": "userlessssclub@gmail.com",
   *                   "aiff_number": "asdas21312",
   *                   "crs_user_name": "CSRF_NAME",
   *                   "legal_guardian_name": "Gopal's Father",
   *                   "player_address": "near other road",
   *                   "player_email": "play@gmail.com",
   *                   "club_academy_intermediary_name": "something",
   *                   "club_academy_transfer_fee": "3423",
   *                   "status": "pending",
   *                   "sent_by": "f4ce1958-d318-4f92-9c72-b17bcaa93bcf",
   *                   "send_to": "704132f1-ddfc-4e82-95d0-d5fb3851fa41",
   *                   "id": "c0fdb242-c067-4369-afe4-67e7be5ce0ef",
   *                   "created_by": "club",
   *                   "send_to_category": "player"
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
   * @apiParam (body) {String} player_name Player Name
   * @apiParam (body) {String} category Category/role of player
   * @apiParam (body) {String} club_academy_name Club academy Name
   * @apiParam (body) {Date} signing_date Signing Date, any past date
   * @apiParam (body) {Date} effective_date Past of future day but should be grater than signing_date
   * @apiParam (body) {Date} expiry_date Expiry Date, max date is effective_date + 5yrs
   * @apiParam (body) {String} place_of_signature Place of signature
   * @apiParam (body) {String} club_academy_representative_name Club academy representative name.
   * @apiParam (body) {String} club_academy_address Club academy address
   * @apiParam (body) {String} club_academy_phone_number club academy phone number
   * @apiParam (body) {String} club_academy_email club academy email
   * @apiParam (body) {String} aiff_number AIFF number
   * @apiParam (body) {String} crs_user_name CRS user name
   * @apiParam (body) {String} legal_guardian_name Legal guardian name
   * @apiParam (body) {String} player_address Player address
   * @apiParam (body) {String} player_mobile_number Player mobile number
   * @apiParam (body) {Email} player_email Player email
   * @apiParam (body) {Boolean} club_academy_uses_agent_services Club uses academy services
   * @apiParam (body) {String} club_academy_intermediary_name Club academy intermediary name
   * @apiParam (body) {String} club_academy_transfer_fee Club transfer fees
   * @apiParam (body) {Boolean} player_uses_agent_services Player uses agent service
   * @apiParam (body) {String} player_intermediary_name Player intermediary name
   * @apiParam (body) {String} player_transfer_fee Player transfer fees
   * @apiParam (body) {String} [other_name]  Other name, required when club_academy_name is 'others'
   * @apiParam (body) {String} [other_email] Other Email required when club_academy_name is 'others'
   * @apiParam (body) {String} [other_phone_number] Other phone required when club_academy_name is 'others'
   *
   * @apiParamExample {json} Request-Example:
   * {
   *   "player_name": "Someone",
   *   "category": "club",
   *   "club_academy_name": "SomeClub",
   *   "signing_date": "2020-06-15",
   *   "effective_date": "2020-06-20",
   *   "expiry_date": "2023-06-20",
   *   "place_of_signature": "General Office",
   *   "club_academy_representative_name": "Gopal",
   *   "club_academy_address": "Near that road",
   *   "club_academy_phone_number": "9898955662",
   *   "club_academy_email": "useless@club.com",
   *   "aiff_number": "asdas21312",
   *   "crs_user_name": "CSRF_NAME",
   *   "legal_guardian_name": "Gopal's Father",
   *   "player_address": "near other road",
   *   "player_mobile_number": "123132155464",
   *   "player_email": "player@localhost.com",
   *   "club_academy_uses_agent_services": true,
   *   "club_academy_intermediary_name": "sdas",
   *   "club_academy_transfer_fee": "asdahy",
   *   "player_uses_agent_services": true,
   *   "player_intermediary_name": "some check",
   *   "player_transfer_fee": "transfer fee",
   *   "other_name": "Some other club",
   *   "other_email": "someotheremail@localhost.com",
   *   "other_phone_number": "2342883888"
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
   * @apiParam (body) {String} player_name Player Name
   * @apiParam (body) {String} category Category/role of player
   * @apiParam (body) {String} club_academy_name Club academy Name
   * @apiParam (body) {Date} signing_date Signing Date, any past date
   * @apiParam (body) {Date} effective_date Past of future day but should be grater than signing_date
   * @apiParam (body) {Date} expiry_date Expiry Date, max date is effective_date + 5yrs
   * @apiParam (body) {String} place_of_signature Place of signature
   * @apiParam (body) {String} club_academy_representative_name Club academy representative name.
   * @apiParam (body) {String} club_academy_address Club academy address
   * @apiParam (body) {String} club_academy_phone_number club academy phone number
   * @apiParam (body) {String} club_academy_email club academy email
   * @apiParam (body) {String} aiff_number AIFF number
   * @apiParam (body) {String} crs_user_name CRS user name
   * @apiParam (body) {String} legal_guardian_name Legal guardian name
   * @apiParam (body) {String} player_address Player address
   * @apiParam (body) {String} player_mobile_number Player mobile number
   * @apiParam (body) {Email} player_email Player email
   * @apiParam (body) {Boolean} club_academy_uses_agent_services Club uses academy services
   * @apiParam (body) {String} club_academy_intermediary_name Club academy intermediary name
   * @apiParam (body) {String} club_academy_transfer_fee Club transfer fees
   * @apiParam (body) {Boolean} player_uses_agent_services Player uses agent service
   * @apiParam (body) {String} player_intermediary_name Player intermediary name
   * @apiParam (body) {String} player_transfer_fee Player transfer fees
   * @apiParam (body) {String} [other_name]  Other name, required when club_academy_name is 'others'
   * @apiParam (body) {String} [other_email] Other Email required when club_academy_name is 'others'
   * @apiParam (body) {String} [other_phone_number] Other phone required when club_academy_name is 'others'
   *
   * @apiParamExample {json} Request-Example:
   * {
   *   "player_name": "Someone",
   *   "category": "club",
   *   "club_academy_name": "SomeClub",
   *   "signing_date": "2020-06-15",
   *   "effective_date": "2020-06-20",
   *   "expiry_date": "2023-06-20",
   *   "place_of_signature": "General Office",
   *   "club_academy_representative_name": "Gopal",
   *   "club_academy_address": "Near that road",
   *   "club_academy_phone_number": "9898955662",
   *   "club_academy_email": "useless@club.com",
   *   "aiff_number": "asdas21312",
   *   "crs_user_name": "CSRF_NAME",
   *   "legal_guardian_name": "Gopal's Father",
   *   "player_address": "near other road",
   *   "player_mobile_number": "123132155464",
   *   "player_email": "player@localhost.com",
   *   "club_academy_uses_agent_services": true,
   *   "club_academy_intermediary_name": "sdas",
   *   "club_academy_transfer_fee": "asdahy",
   *   "player_uses_agent_services": true,
   *   "player_intermediary_name": "some check",
   *   "player_transfer_fee": "transfer fee",
   *   "other_name": "Some other club",
   *   "other_email": "someotheremail@localhost.com",
   *   "other_phone_number": "2342883888"
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
