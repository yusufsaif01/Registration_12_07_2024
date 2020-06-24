const Joi = require("@hapi/joi");
const moment = require("moment");
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const Role = require("../../constants/Role");
const CONTRACT_STATUS = require("../../constants/ContractStatus");

class EmploymentContractValidator {
  async createValidator(req, res, next) {
    const schema = Joi.object().keys({
      playerName: Joi.string().required(),
      category: Joi.string().required().valid([Role.CLUB, Role.ACADEMY]),

      clubAcademyName: Joi.string().required(),

      signingDate: Joi.date()
        .required()
        .max(moment().subtract(1, "d").format("YYYY-MM-DD")),
      effectiveDate: Joi.date().required().min(Joi.ref("signingDate")),
      expiryDate: Joi.date().required().min(Joi.ref("effectiveDate")),

      placeOfSignature: Joi.string().optional(),
      clubAcademyRepresentativeName: Joi.string().optional(),
      clubAcademyAddress: Joi.string().optional(),
      clubAcademyPhoneNumber: Joi.string()
        .length(10)
        .regex(/^[0-9]+$/)
        .required(),
      clubAcademyEmail: Joi.string().email().required(),
      aiffNumber: Joi.string().optional(),
      crsUserName: Joi.string().optional(),

      legalGuardianName: Joi.string().optional(),
      playerAddress: Joi.string().optional(),
      playerMobileNumber: Joi.string()
        .length(10)
        .regex(/^[0-9]+$/)
        .required(),
      playerEmail: Joi.string().email().required(),

      clubAcademyUsesAgentServices: Joi.boolean().required(),
      clubAcademyIntermediaryName: Joi.when("clubAcademyUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }),
      clubAcademyTransferFee: Joi.when("clubAcademyUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }),

      playerUsesAgentServices: Joi.boolean().required(),
      playerIntermediaryName: Joi.when("playerUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      playerTransferFee: Joi.when("playerUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),

      otherName: Joi.when("clubAcademyName", {
        is: "others",
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }),
      otherEmail: Joi.when("clubAcademyName", {
        is: "others",
        then: Joi.string().email().required(),
        otherwise: Joi.string(),
      }),
      otherPhoneNumber: Joi.when("clubAcademyName", {
        is: "others",
        then: Joi.string()
          .length(10)
          .regex(/^[0-9]+$/)
          .required(),
        otherwise: Joi.string(),
      }),
    });
    try {
      let body = await Joi.validate(req.body, schema);
      req.body = body;
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

  async UpdateStatusValidator(req, res, next) {
    const schema = Joi.object().keys({
      status: Joi.required().valid([
        CONTRACT_STATUS.APPROVED,
        CONTRACT_STATUS.DISAPPROVED,
      ]),
      remarks: Joi.when("status", {
        is: CONTRACT_STATUS.DISAPPROVED,
        then: Joi.required(),
        otherwise: Joi.string(),
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

module.exports = new EmploymentContractValidator();
