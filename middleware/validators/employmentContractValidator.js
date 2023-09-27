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
      user_id: Joi.when("club_academy_name", {
        is: "Others",
        then: Joi.string(),
        otherwise: Joi.string().required(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.USER_ID_REQUIRED,
        };
      }),
      player_name: Joi.string()
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.PLAYER_NAME_REQUIRED,
          };
        }),
      category: Joi.string()
        .required()
        .valid([Role.CLUB, Role.ACADEMY])
        .error(
          customMessage(
            {
              "any.required": RESPONSE_MESSAGE.CATEGORY_REQUIRED,
            },
            RESPONSE_MESSAGE.CATEGORY_INVALID
          )
        ),

      club_academy_name: Joi.string()
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.CLUB_ACADEMY_NAME_REQUIRED,
          };
        }),

      signing_date: Joi.date()
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
      effective_date: Joi.date()
        .required()
        .min(Joi.ref("signing_date"))
        .error(
          customMessage(
            {
              "any.required": RESPONSE_MESSAGE.EFFECTIVE_DATE_REQUIRED,
            },
            RESPONSE_MESSAGE.EFFECTIVE_DATE_INVALID
          )
        ),
      expiry_date: Joi.date()
        .required()
        .min(Joi.ref("effective_date"))
        .error(
          customMessage(
            {
              "any.required": RESPONSE_MESSAGE.EXPIRY_DATE_REQUIRED,
            },
            RESPONSE_MESSAGE.EXPIRY_DATE_INVALID
          )
        ),
      place_of_signature: Joi.string().optional(),
      club_academy_representative_name: Joi.string().optional(),
      club_academy_address: Joi.string().optional(),
      club_academy_phone_number: Joi.when("club_academy_name", {
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
      club_academy_email: Joi.when("club_academy_name", {
        is: "Others",
        then: Joi.string(),
        otherwise: Joi.string().email().required(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.CLUB_ACADEMY_EMAIL_INVALID,
        };
      }),
      aiff_number: Joi.string().optional(),
      crs_user_name: Joi.string().optional(),

      legal_guardian_name: Joi.string().optional(),
      player_address: Joi.string().optional(),
      player_mobile_number: Joi.string()
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
      player_email: Joi.string()
        .email()
        .required()
        .error(() => {
          return {
            message: RESPONSE_MESSAGE.PLAYER_EMAIL_INVALID,
          };
        }),

      club_academy_uses_agent_services: Joi.boolean().optional(),
      club_academy_intermediary_name: Joi.string().optional(),
      club_academy_transfer_fee: Joi.string().optional(),

      player_uses_agent_services: Joi.boolean().optional(),
      player_intermediary_name: Joi.string().optional(),
      player_transfer_fee: Joi.string().optional(),

      other_name: Joi.when("club_academy_name", {
        is: "Others",
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.OTHER_NAME_REQUIRED,
        };
      }),
      other_email: Joi.when("club_academy_name", {
        is: "Others",
        then: Joi.string().email().required(),
        otherwise: Joi.string(),
      }).error(() => {
        return {
          message: RESPONSE_MESSAGE.OTHER_EMAIL_REQUIRED,
        };
      }),
      other_phone_number: Joi.when("club_academy_name", {
        is: "Others",
        then: Joi.string()
          .length(10)
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
      delete validationSchema.other_name;
      delete validationSchema.other_email;
      delete validationSchema.other_phone_number;
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
