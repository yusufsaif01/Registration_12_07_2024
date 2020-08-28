const Joi = require("@hapi/joi");
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require("../../constants/ResponseMessage");

class AccessTokenValidator {
  async request(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
    });
    try {
      const reqBody = await Joi.validate(req.body, schema);
      req.body = reqBody;
      return next();
    } catch (err) {
      console.log(err.details);
      return responseHandler(
        req,
        res,
        Promise.reject(new errors.ValidationFailed(err.details[0].message))
      );
    }
  }
}

module.exports = new AccessTokenValidator();
