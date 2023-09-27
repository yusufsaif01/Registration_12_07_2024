const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");

class ConnectionValidator {
    async connectionRequestAPIValidation(req, res, next) {
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

    async mutualAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "mutual_with": Joi.string().required()
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

module.exports = new ConnectionValidator();