const Joi = require("@hapi/joi");
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const CONTRACT_STATUS = require("../../constants/ContractStatus");

class EmploymentContractValidator {
    async UpdateStatusValidator(req, res, next) {
        const schema = Joi.object().keys({
            "status": Joi.required().valid([CONTRACT_STATUS.APPROVED,CONTRACT_STATUS.DISAPPROVED]),
            "remarks": Joi.when("status", {
                is: CONTRACT_STATUS.DISAPPROVED,
                then: Joi.required(),
                otherwise: Joi.string()
            }),
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

module.exports = new EmploymentContractValidator();
