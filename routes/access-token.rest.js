const AccessTokenService = require("../services/AccessTokenService");
const accessTokenValidator = require("../middleware/validators/accessTokenValidator");
const ResponseHandler = require("../ResponseHandler");
const checkAccessToken = require("../middleware/auth/access-token");

const accessTokenInst = new AccessTokenService();

module.exports = (router) => {
  /**
   * @api {post} /access-token/request Request for access token.
   * @apiName Access Token Request
   * @apiGroup Access Token
   *
   *
   * @apiParam (body) {string} email Email of the user requesting for token.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *     "email": "user@localhost.com"
   * }
   *
   *
   * @apiSuccess {String} status Status of the Response.
   * @apiSuccess {String} message  Success Message.
   *
   * @apiSuccessExample {json} Response-Example:
   * {
   *     "status": "success",
   *     "message": "Successfully done"
   * }
   * @apiErrorExample {json} Email not whitelisted:
   * {
   *     "code": "NOT_FOUND",
   *     "message": "Not Found",
   *     "httpCode": 404
   * }
   *
   */
  router.post("/request", accessTokenValidator.request, (req, res) => {
    ResponseHandler(req, res, accessTokenInst.requestOtp(req.body.email));
  });

  /**
   * @api {post} /access-token/verify Verify OTP
   * @apiName Access Token Verify OTP
   * @apiGroup Access Token
   *
   *
   * @apiParam (body) {string} email Email of the user OTP was sent to
   * @apiParam (body) {string} otp OTP received over email.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *     "email": "user@localhost.com",
   *     "otp": "121121",
   * }
   *
   *
   * @apiSuccess {String} status Status of the Response.
   * @apiSuccess {String} message  Success Message.
   *
   * @apiSuccessExample {json} Response-Example:
   * {
   *     "status": "success",
   *     "message": "Successfully done"
   * 	 "data": {
   * 		"access_token": "..."
   * 	 }
   * }
   * @apiErrorExample {json} Record not found.
   * {
   *     "code": "NOT_FOUND",
   *     "message": "Not Found",
   *     "httpCode": 404
   * }
   * @apiErrorExample {json} OTP Expired:
   * {
   *     "code": "BAD_REQUEST",
   *     "message": "OTP has expired",
   *     "httpCode": 400
   * }
   */
  router.post("/verify", accessTokenValidator.verify, (req, res) => {
    ResponseHandler(req, res, accessTokenInst.verifyOtp(req.body));
  });

  /**
   * @api {post} /access-token/check Checks Access Token
   * @apiName Access Token Check
   * @apiGroup Access Token
   *
   * @apiHeader {String} X-Access-Token Access token.
   *
   * @apiHeaderExample {json} Header-Example:
   * {
   * 	"X-Access-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   *
   * @apiSuccess {String} status Status of the Response.
   * @apiSuccess {String} message  Success Message.
   *
   * @apiSuccessExample {json} Response-Example:
   * {
   *     "status": "success",
   *     "message": "Successfully done"
   * }
   * @apiErrorExample {json} Access Token Required.
   * {
   *     "code": "UNAUTHORIZED",
   *     "message": "Access token is required",
   *     "httpCode": 401
   * }
   * @apiErrorExample {json} Access Token Expired.
   * {
   *     "code": "UNAUTHORIZED",
   *     "message": "Access token is expired",
   *     "httpCode": 401
   * }
   * @apiErrorExample {json} Access Token Invalid.
   * {
   *     "code": "UNAUTHORIZED",
   *     "message": "Access token is invalid",
   *     "httpCode": 401
   * }
   *
   */
  router.get("/check", checkAccessToken(), (req, res) => {
    ResponseHandler(req, res, Promise.resolve());
  });
};
