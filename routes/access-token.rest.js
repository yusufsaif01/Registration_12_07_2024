const AccessTokenService = require("../services/AccessTokenService");
const accessTokenValidator = require("../middleware/validators/accessTokenValidator");
const ResponseHandler = require("../ResponseHandler");

const accessTokenInst = new AccessTokenService();

module.exports = (router) => {
	router.post(
		"/access-token/request",
		accessTokenValidator.request,
		(req, res) => {
			ResponseHandler(
				req,
				res,
				accessTokenInst.requestOtp(req.body.email)
			);
		}
	);

	router.post(
		"/access-token/verify",
		accessTokenValidator.verify,
		(req, res) => {
			ResponseHandler(
				req,
				res,
				accessTokenInst.verifyOtp(req.body)
			);
		}
	);

	router.post("/access-token/check", () => {});
};
