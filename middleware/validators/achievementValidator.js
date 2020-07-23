const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');
const customMessage = require("./CustomMessages");

class AchievementValidator {
    async addAchievementAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "type": Joi.string().required(),
            "name": Joi.string().regex(/^[a-zA-Z0-9\&\@\(\)\#\- ]+$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            }),
            "from": Joi.date().required().min(0).error(
                customMessage(
                    {
                        "any.required": RESPONSE_MESSAGE.FROM_REQUIRED,
                    },
                    RESPONSE_MESSAGE.FROM_INVALID
                )
            ),
            "to": Joi.date().required().min(Joi.ref("from"))
                .error(
                    customMessage(
                        {
                            "any.required": RESPONSE_MESSAGE.TO_REQUIRED,
                            "date.min": RESPONSE_MESSAGE.FROM_GREATER_THAN_TO
                        },
                        RESPONSE_MESSAGE.TO_INVALID
                    )
                ),
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