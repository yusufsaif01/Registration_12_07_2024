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

    async postListQueryValidation(req, res, next) {

        const query = Joi.object().keys({
            "page_size": Joi.number(),
            "page_no": Joi.number(),
            "comments": Joi.number().valid(1, 0)
        })
        try {

            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new PostValidator();