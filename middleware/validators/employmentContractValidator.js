const Joi = require("@hapi/joi");
const moment = require("moment");
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const Role = require("../../constants/Role");
const CONTRACT_STATUS = require("../../constants/ContractStatus");

class EmploymentContractValidator {
  async createValidator(req, res, next) {
    const validationSchema = {
      playerName: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Player name is required.",
          };
        }),
      category: Joi.string()
        .required()
        .valid([Role.CLUB, Role.ACADEMY])
        .error(() => {
          return {
            message: "Category is invalid.",
          };
        }),

      clubAcademyName: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Club Academy name is required.",
          };
        }),

      signingDate: Joi.date()
        .required()
        .max(moment().subtract(1, "d").format("YYYY-MM-DD"))
        .error(() => {
          return {
            message: "Signing Date should be a valid date and before today.",
          };
        }),
      effectiveDate: Joi.date()
        .required()
        .min(Joi.ref("signingDate"))
        .error(() => {
          return {
            message:
              "Effective date should be a valid date and greater than Signing Date.",
          };
        }),
      expiryDate: Joi.date()
        .required()
        .min(Joi.ref("effectiveDate"))
        .error(() => {
          return {
            message: "Expiry Date should be a valid date.",
          };
        }),

      placeOfSignature: Joi.string().optional(),
      clubAcademyRepresentativeName: Joi.string().optional(),
      clubAcademyAddress: Joi.string().optional(),
      clubAcademyPhoneNumber: Joi.string()
        .length(10)
        .regex(/^[0-9]+$/)
        .required()
        .error(() => {
          return {
            message: "Club Academy Number should be a valid number.",
          };
        }),
      clubAcademyEmail: Joi.string()
        .email()
        .required()
        .error(() => {
          return {
            message: "Club Academy email should be a valid email.",
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
            message: "Player mobile number should be a valid number.",
          };
        }),
      playerEmail: Joi.string()
        .email()
        .required()
        .error(() => {
          return {
            message: "Player email should be a valid email.",
          };
        }),

      clubAcademyUsesAgentServices: Joi.boolean()
        .optional()
        .error(() => {
          return {
            message: "Club uses academy agent services should be 'yes' or 'no'",
          };
        }),
      clubAcademyIntermediaryName: Joi.when("clubAcademyUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message:
            "Club/Academy Intermediary name is required when 'Club/Academy requires Agent services' is 'yes'",
        };
      }),
      clubAcademyTransferFee: Joi.when("clubAcademyUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message:
            "Club/Academy Transfer fees is required when 'Club/Academy requires Agent services' is 'yes'",
        };
      }),

      playerUsesAgentServices: Joi.boolean()
        .optional()
        .error(() => {
          return {
            message:
              "Player uses academy agent services should be 'yes' or 'no'",
          };
        }),
      playerIntermediaryName: Joi.when("playerUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }).error(() => {
        return {
          message:
            "Player intermediary name is required when 'Player requires Agent services' is 'yes'",
        };
      }),
      playerTransferFee: Joi.when("playerUsesAgentServices", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }).error(() => {
        return {
          message:
            "Player Transfer fees is required when 'Player requires Agent services' is 'yes'",
        };
      }),

      otherName: Joi.when("clubAcademyName", {
        is: "others",
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: "Other name is required when Club/Academy name is 'others'.",
        };
      }),
      otherEmail: Joi.when("clubAcademyName", {
        is: "others",
        then: Joi.string().email().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message:
            "Other email is required when Club/Academy name is 'others'.",
        };
      }),
      otherPhoneNumber: Joi.when("clubAcademyName", {
        is: "others",
        then: Joi.string()
          .length(10)
          .regex(/^[0-9]+$/)
          .required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message:
            "Other phone number is required when Club/Academy name is 'others'.",
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
