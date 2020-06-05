const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');
const MEMBER = require('../../constants/MemberType');

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

    async footplayerRequestListValidation(req, res, next) {
        const query = Joi.object().keys({
            "requested_by": Joi.string().required().valid(MEMBER.CLUB, MEMBER.ACADEMY),
            "page_size": Joi.number(),
            "page_no": Joi.number()
        });
        try {
            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async footplayerInviteValidation(req, res, next) {
        const schema = Joi.object().keys({
            "f_name": Joi.string(),
            "l_name": Joi.string(),
            "phone": Joi.string(),
            "email": Joi.string().email({ minDomainSegments: 2 }),
        });
        try {
            await Joi.validate(req.body, schema);
            if (req.body.phone && !req.body.email) {
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.INVITE_BY_PHONE_UNAVAILABLE)));
            }
            if (!req.body.email) {
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.EMAIL_REQUIRED)));
            }
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new FootPlayerValidator();