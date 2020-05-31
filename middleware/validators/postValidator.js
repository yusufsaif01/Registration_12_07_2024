const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');

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
            "comment": Joi.string().trim().required(),
        });
        function prepareCommentText(str) {
            str = str.replace(/(^\s*)|(\s*$)/gi, "");
            str = str.replace(/[ ]{2,}/gi, " ");
            str = str.replace(/\n /, "\n");
            return str;
        }

        try {
            await Joi.validate(req.body, schema);
            if (req.body.comment) {
                let comment = prepareCommentText(req.body.comment)
                let totalWords = comment.split(' ').length;
                if (totalWords > 60) {
                    return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.MAX_60_WORDS_FOR_COMMENT)));
                }
                req.body.comment = comment;
            }
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new PostValidator();