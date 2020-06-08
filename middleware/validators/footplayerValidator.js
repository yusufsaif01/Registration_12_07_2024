const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');

class FootPlayerValidator {

    async footplayerSearchQueryValidation(req, res, next) {

        const query = Joi.object().keys({
            "name": Joi.string(),
            "email": Joi.string(),
            "phone": Joi.string()
        })
        try {
            await Joi.validate(req.query, query);
            if (!req.query.email && !req.query.phone) {
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.EMAIL_OR_PHONE_REQUIRED)));
            }
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new FootPlayerValidator();