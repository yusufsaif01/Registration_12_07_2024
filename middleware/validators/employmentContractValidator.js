const Joi = require("@hapi/joi");
const moment = require("moment");
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const Role = require("../../constants/Role");
const CONTRACT_STATUS = require("../../constants/ContractStatus");
const RESPONSE_MESSAGE = require("../../constants/ResponseMessage");
const customMessage = require("./CustomMessages");

class EmploymentContractValidator {
  async createValidator(req, res, next) {
    const validationSchema = {
      user_id: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string(),
        otherwise: Joi.string().required(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.USER_ID_REQUIRED,
        };
      }),
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
        .error(
          customMessage(
            {
              "any.required": RESPONSE_MESSAGE.SIGNING_DATE_REQUIRED,
            },
            RESPONSE_MESSAGE.SIGNING_DATE_INVALID
          )
        ),
      effectiveDate: Joi.date()
        .required()
        .min(Joi.ref("signingDate"))
        .error(
          customMessage(
            {
              "any.required": RESPONSE_MESSAGE.EFFECTIVE_DATE_REQUIRED,
            },
            RESPONSE_MESSAGE.EFFECTIVE_DATE_INVALID
          )
        ),
      expiryDate: Joi.date()
        .required()
        .min(Joi.ref("effectiveDate"))
        .error(
          customMessage(
            {
              "any.required": RESPONSE_MESSAGE.EXPIRY_DATE_REQUIRED,
            },
            RESPONSE_MESSAGE.EXPIRY_DATE_INVALID
          )
        ),
      placeOfSignature: Joi.string().optional(),
      clubAcademyRepresentativeName: Joi.string().optional(),
      clubAcademyAddress: Joi.string().optional(),
      clubAcademyPhoneNumber: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string(),
        otherwise: Joi.string()
          .length(10)
          .regex(/^[0-9]+$/),
      }).error(
        customMessage(
          {
            "any.required": RESPONSE_MESSAGE.CLUB_ACADEMY_PHONE_REQUIRED,
          },
          RESPONSE_MESSAGE.CLUB_ACADEMY_PHONE_INVALID
        )
      ),
      clubAcademyEmail: Joi.when("clubAcademyName", {
        is: "Others",
        then: Joi.string(),
        otherwise: Joi.string().email().required(),
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
        .error(
          customMessage(
            {
              "any.required": RESPONSE_MESSAGE.PLAYER_MOBILE_NUMBER_REQUIRED,
            },
            RESPONSE_MESSAGE.PLAYER_MOBILE_NUMBER_INVALID
          )
        ),
      playerEmail: Joi.string()
        .email()
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.PLAYER_EMAIL_INVALID,
          };
        }),

      clubAcademyUsesAgentServices: Joi.boolean().optional(),
      clubAcademyIntermediaryName: Joi.string().optional(),
      clubAcademyTransferFee: Joi.string().optional(),

      playerUsesAgentServices: Joi.boolean().optional(),
      playerIntermediaryName: Joi.string().optional(),
      playerTransferFee: Joi.string().optional(),

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
          .required()
          .regex(/^[0-9]+$/),
        otherwise: Joi.string(),
      }).error(
        customMessage(
          {
            "any.required": RESPONSE_MESSAGE.OTHER_PHONE_REQUIRED,
          },
          RESPONSE_MESSAGE.OTHER_PHONE_INVALID
        )
      ),
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
