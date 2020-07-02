const Joi = require("@hapi/joi");
const moment = require("moment");
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const Role = require("../../constants/Role");
const CONTRACT_STATUS = require("../../constants/ContractStatus");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');

class EmploymentContractValidator {
  async createValidator(req, res, next) {
    const validationSchema = {
      user_id: Joi.string().required(),
      playerName: Joi.string()
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.PLAYER_NAME_REQUIRED,
          };
        }),
      category: Joi.string()
        .required()
        .valid([Role.CLUB, Role.ACADEMY])
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.CATEGORY_INVALID,
          };
        }),

      clubAcademyName: Joi.string()
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.CLUB_ACADEMY_NAME_REQUIRED,
          };
        }),

      signingDate: Joi.date()
        .required()
        .max(moment().subtract(1, "d").format("YYYY-MM-DD"))
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.SIGNING_DATE_INVALID,
          };
        }),
      effectiveDate: Joi.date()
        .required()
        .min(Joi.ref("signingDate"))
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.EFFECTIVE_DATE_INVALID,
          };
        }),
      expiryDate: Joi.date()
        .required()
        .min(Joi.ref("effectiveDate"))
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.EXPIRY_DATE_INVALID,
          };
        }),

      placeOfSignature: Joi.string().optional(),
      clubAcademyRepresentativeName: Joi.string().optional(),
      clubAcademyAddress: Joi.string().optional(),
      clubAcademyPhoneNumber: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string(),
        otherwise: Joi.string()
          .length(10)
          .regex(/^[0-9]+$/)
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.CLUB_ACADEMY_PHONE_INVALID,
        };
      }),
      clubAcademyEmail: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string(),
        otherwise: Joi.string().email().required()
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.CLUB_ACADEMY_EMAIL_INVALID,
        };
      }),
      aiffNumber: Joi.string().optional(),
      crsUserName: Joi.string().optional(),

      legalGuardianName: Joi.string().optional(),
      playerAddress: Joi.string().optional(),
      playerMobileNumber: Joi.string()
        .length(10)
        .regex(/^[0-9]+$/)
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.PLAYER_MOBILE_NUMBER_INVALID,
          };
        }),
      playerEmail: Joi.string()
        .email()
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.PLAYER_EMAIL_INVALID,
          };
        }),

      clubAcademyUsesAgentServices: Joi.boolean()
        .optional()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.CLUB_ACADEMY_USES_AGENT_SERVICES,
          };
        }),
      clubAcademyIntermediaryName: Joi.when("clubAcademyUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.CLUB_ACADEMY_INTERMEDIARY_REQUIRED,
        };
      }),
      clubAcademyTransferFee: Joi.when("clubAcademyUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.CLUB_ACADEMY_TRANSFER_FEE_REQUIRED,
        };
      }),

      playerUsesAgentServices: Joi.boolean()
        .optional()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.PLAYER_USES_AGENT_SERVICES,
          };
        }),
      playerIntermediaryName: Joi.when("playerUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.PLAYER_INTERMEDIARY_REQUIRED,
        };
      }),
      playerTransferFee: Joi.when("playerUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.PLAYER_TRANSFER_FEE_REQUIRED,
        };
      }),

      otherName: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.OTHER_NAME_REQUIRED,
        };
      }),
      otherEmail: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string().email().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.OTHER_EMAIL_REQUIRED,
        };
      }),
      otherPhoneNumber: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string()
          .length(10)
          .regex(/^[0-9]+$/),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.OTHER_PHONE_REQUIRED,
        };
      }),
    };

    /** Remove fields not required when club/academy is creating the contract. */
    if ([Role.ACADEMY, Role.CLUB].includes(req.authUser.role)) {
      delete validationSchema.category;
      delete validationSchema.otherName;
      delete validationSchema.otherEmail;
      delete validationSchema.otherPhoneNumber;
    }

    const schema = Joi.object().keys(validationSchema);

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
