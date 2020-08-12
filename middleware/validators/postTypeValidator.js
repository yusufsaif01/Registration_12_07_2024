const ResponseHandler = require("../../ResponseHandler");
const PostType = require("../../constants/PostType");
const errors = require("../../errors");
const ResponseMessage = require("../../constants/ResponseMessage");
const Role = require("../../constants/Role");
const Joi = require("@hapi/joi");

module.exports = {
  middleware(req, res, next) {
    const { type } = req.query;
    if (!PostType.ALLOWED_POST_TYPES.includes(type)) {
      return ResponseHandler(
        req,
        res,
        Promise.reject(
          new errors.ValidationFailed(ResponseMessage.INVALID_POST_TYPE)
        )
      );
    }
    next();
  },
  userCanUploadVideo(req, res, next) {
    const { type } = req.query;

    if (type != PostType.TIMELINE && req.authUser.role == Role.PLAYER) {
      return ResponseHandler(
        req,
        res,
        Promise.reject(
          new errors.ValidationFailed(
            ResponseMessage.NOT_ALLOWED_TO_UPLOAD_VIDEO
          )
        )
      );
    }
    next();
  },
  async validateData(req, res, next) {
    const playerRestrictions = {
      max_attributes: 3,
      max_abilities: 2,
    };

    let abilitiesSchema = Joi.array().min(1).required().unique('attributes');
    let attributesSchema = Joi.array().min(1).required().unique();

    if (req.authUser.role == Role.PLAYER) {
      abilitiesSchema = abilitiesSchema.max(playerRestrictions.max_abilities);
      attributesSchema = attributesSchema.max(
        playerRestrictions.max_attributes
      );
    }

    const schema = Joi.object().keys({
      tags: abilitiesSchema.items(
        Joi.object().keys({
          ability: Joi.string().required(),
          attributes: attributesSchema.items(Joi.string().required()),
        })
      ),
    });

    try {
      const body = await Joi.validate(req.body, schema);
      req.body = body;
      next();
    } catch (error) {
      console.log(error);
      return ResponseHandler(
        req,
        res,
        Promise.reject(new errors.ValidationFailed(error.details[0].message))
      );
    }
  },
};
