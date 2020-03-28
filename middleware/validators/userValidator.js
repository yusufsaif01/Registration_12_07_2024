const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");

class UserValidator {

    async createAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            /**
             * Add your validations here
             */
            // "role" : Joi.string(),
            "state" : Joi.string().required(),
            "country" : Joi.string().required(),
            "phone" : Joi.string().min(10).required().max(10),
            "user_id" : Joi.string().alphanum().min(5).max(30).required(),
            "member_type" : Joi.string().valid("player","club","academy").required(),
            // "dob" : Joi.string().min(8).max(30),
            "name" : Joi.string().alphanum().min(3).max(30),
            "first_name" : Joi.string().alphanum().min(3).max(30),
            "last_name" : Joi.string().alphanum().min(3).max(30),
            "registration_number" : Joi.string().alphanum().min(3).max(30),
            
            "password" : Joi.string().alphanum().min(3).max(30).required(),
            "email"      : Joi.string().email({ minDomainSegments: 2 }).required(),
            "username" : Joi.string().alphanum().min(3).max(30).required()
        });

        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async updateAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            /**
             * Add your validations here
             */
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

module.exports = new UserValidator();

