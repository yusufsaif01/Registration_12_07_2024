const Joi = require("@hapi/joi");
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require("../../constants/ResponseMessage");
const MEMBER = require("../../constants/MemberType");
const Role = require("../../constants/Role");

class EmploymentContractValidator {
  async createValidator(req, res, next) {
    const schema = Joi.object().keys({
      playerName: Joi.string().required(),
      category: Joi.string().required().valid([Role.CLUB, Role.ACADEMY]),

      clubAcademyName: Joi.string().required(),

      signingDate: Joi.date().required().max("now"),
      effectiveDate: Joi.date().required().min(Joi.ref("signingDate")),
      expiryDate: Joi.date().required().min(Joi.ref("effectiveDate")),

      placeOfSignature: Joi.string().required(),
      clubAcademyRepresentativeName: Joi.string().required(),
      clubAcademyAddress: Joi.string().required(),
      clubAcademyPhoneNumber: Joi.string().required(),
      clubAcademyEmail: Joi.string().required(),
      aiffNumber: Joi.string().required(),
      crsUserName: Joi.string().required(),

      legalGuardianName: Joi.string().required(),
      playerAddress: Joi.string().required(),
      playerMobileNumber: Joi.string().required(),
      playerEmail: Joi.string().required(),

      clubAcademyUsesAgentServices: Joi.boolean().required(),
      clubAcademyIntermediaryName: Joi.when(
        Joi.ref("clubAcademyUsesAgentServices"),
        {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.string(),
        }
      ),
      clubAcademyTransferFee: Joi.string().when(
        Joi.ref("clubAcademyUsesAgentServices"),
        {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.string(),
        }
      ),

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
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }),
      otherPhoneNumber: Joi.when("clubAcademyName", {
        is: "others",
        then: Joi.string().required(),
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
}

module.exports = new EmploymentContractValidator();
