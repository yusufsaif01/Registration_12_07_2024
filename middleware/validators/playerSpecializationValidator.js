const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');

class PlayerSpecializationValidator {
    async AbilityAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "name": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            })
        });
        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async addAttributeAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "name": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            }),
            "ability_id": Joi.string().required()
        });
        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async editAttributeAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "name": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            })
        });
        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async PositionAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "name": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            }),
            "abbreviation": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.ABBREVIATION_INVALID,
                };
            }),
            "abilities": Joi.array()
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

module.exports = new PlayerSpecializationValidator();