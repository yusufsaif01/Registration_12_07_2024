const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');

class AchievementValidator {
    async addAchievementAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "type": Joi.string().required(),
            "name": Joi.string().regex(/^[a-zA-Z0-9\&\@\(\)\#\- ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            }),
            "year": Joi.date().required(),
            "position": Joi.string().regex(/^[a-zA-Z0-9\&\@\(\)\#\- ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.POSITION_INVALID,
                };
            }),
            "achievement": Joi.any()
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

module.exports = new AchievementValidator();