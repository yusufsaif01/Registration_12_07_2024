const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");

class PostValidator {
    async addPostAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "text": Joi.string().trim().min(1).max(60),
            "media": Joi.any()
        });
        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async addCommentAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "comment": Joi.string().trim().min(1).max(60).required(),
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

module.exports = new PostValidator();