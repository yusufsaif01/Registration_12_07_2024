const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");

class AchievementValidator {
    async addAchievementAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "type": Joi.string().required(),
            "name": Joi.string().regex(/^[a-zA-Z0-9\&\@\(\)\#\- ]+$/).error(() => {
                return {
                    message: 'Invalid name',
                };
            }),
            "year": Joi.date().required(),
            "position": Joi.string().regex(/^[a-zA-Z0-9\&\@\(\)\#\- ]+$/).error(() => {
                return {
                    message: 'Invalid position',
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