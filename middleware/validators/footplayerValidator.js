const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');

class FootPlayerValidator {

    async footplayerSearchQueryValidation(req, res, next) {

        const query = Joi.object().keys({
            "first_name": Joi.string(),
            "last_name": Joi.string(),
            "email": Joi.string(),
            "phone": Joi.string()
        })
        try {
            await Joi.validate(req.query, query);
            if (!req.query.first_name) {
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.FIRST_NAME_REQUIRED)));
            }
            if (!req.query.last_name) {
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.LAST_NAME_REQUIRED)));
            }
            if (!req.query.email && !req.query.phone) {
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.EMAIL_OR_PHONE_REQUIRED)));
            }
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async footplayerRequestAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "to": Joi.string().required()
        });
        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new FootPlayerValidator();