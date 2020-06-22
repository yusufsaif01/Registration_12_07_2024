const responseHandler = require("../ResponseHandler");
const { checkAuthToken, checkRole } = require("../middleware/auth");
const ROLE = require("../constants/Role");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const EmploymentContractService = require("../services/EmploymentContractService");
const employmentContractValidator = require("../middleware/validators/employmentContractValidator");

const contractService = new EmploymentContractService();

module.exports = (router) => {
  router.get("/employment-contract/list", (req, res, next) => {});
  router.get("/employment-contract/:id", (req, res, next) => {});

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

  router.delete("/employment-contract/:id", (req, res, next) => {});
  router.put("/employment-contract/:id/status", (req, res, next) => {});
};
