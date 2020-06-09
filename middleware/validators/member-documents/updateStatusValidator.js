const Joi = require("@hapi/joi");
const errors = require("../../../errors");
const responseHandler = require("../../../ResponseHandler");
const RESPONSE_MESSAGE = require("../../../constants/ResponseMessage");
const PlayerDocumentStatus = require("../../../constants/DocumentStatus");
const DocumentType = require("../../../constants/DocumentType");
/**
 * Update status validator for documents.
 */
class UpdateStatusValidator {
  async addUpdateStatusValidator(req, res, next) {
    const schema = Joi.object().keys({
      status: Joi.required().valid([
        PlayerDocumentStatus.APPROVED,
        PlayerDocumentStatus.PENDING,
        PlayerDocumentStatus.DISAPPROVED,
      ]),
      type: Joi.required().valid([
        DocumentType.AIFF, DocumentType.AADHAR, DocumentType.EMPLOYEMENT_CONTRACT,
        DocumentType.PAN, DocumentType.TIN, DocumentType.COI
      ]),
      remarks: Joi.when("status", {
        is: PlayerDocumentStatus.DISAPPROVED,
        then: Joi.required(),
        otherwise: Joi.string()
      }),
    });
    try {
      await Joi.validate(req.body, schema);
      return next();
    } catch (err) {
      console.log(err.details);
      return responseHandler(
        req,
        res,
        Promise.reject(new errors.ValidationFailed(err.details[0].message))
      );
    }
  }
}

module.exports = new UpdateStatusValidator();
