const AccessTokenService = require("../services/AccessTokenService");
const accessTokenValidator = require("../middleware/validators/accessTokenValidator");
const ResponseHandler = require("../ResponseHandler");
const checkAccessToken = require("../middleware/auth/access-token");

const accessTokenInst = new AccessTokenService();

module.exports = (router) => {
  router.post("/request", accessTokenValidator.request, (req, res) => {
    ResponseHandler(req, res, accessTokenInst.requestOtp(req.body.email));
  });

  router.post("/verify", accessTokenValidator.verify, (req, res) => {
    ResponseHandler(req, res, accessTokenInst.verifyOtp(req.body));
  });

  router.get("/check", checkAccessToken(), (req, res) => {
    ResponseHandler(req, res, Promise.resolve());
  });
};
