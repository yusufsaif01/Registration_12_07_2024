const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");

class PlayerSpecializationValidator {
    async AbilityAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "name": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: 'Invalid name',
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
    async addParameterAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "name": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: 'Invalid name',
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
    async editParameterAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "name": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: 'Invalid name',
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
                    message: 'Invalid name',
                };
            }),
            "abbreviation": Joi.string().required().regex(/^[a-zA-Z ]+$/).error(() => {
                return {
                    message: 'Invalid abbreviation',
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