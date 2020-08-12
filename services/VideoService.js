const POST_TYPE = require("../constants/PostType");
const ROLE = require("../constants/Role");
const AbilityUtility = require("../db/utilities/AbilityUtility");
const AttributeUtility = require("../db/utilities/AttributeUtility");
const errors = require("../errors");
const ResponseMessage = require("../constants/ResponseMessage");
const vimeoLib = require("../lib/vimeo");

const abilityInst = new AbilityUtility();
const attributeInst = new AttributeUtility();

module.exports = class VideoService {
  constructor() {}

  async uploadVideo(authUser, type, { tags, media }) {
    try {
      const videoOptions = this.getUploadOptions(authUser, type);
      await this.validateAttributesAndAbilities(tags);
      await this.uploadToVimeo(media, videoOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getUploadOptions(authUser, type) {
    const options = {
      [POST_TYPE.TIMELINE]: {
        max_duration: 60 * 2,
      },
      [POST_TYPE.LEARNING_OR_TRAINING_VIDEO]: {
        max_duration: 60 * 30,
      },
      [POST_TYPE.MATCH_VIDEOS]: {
        max_duration: 150 * 60,
      },
    };

    if ([ROLE.CLUB, ROLE.ACADEMY].includes(authUser.role)) {
      options[POST_TYPE.TIMELINE].max_duration = 60 * 10;
    }

    return options[type];
  }

  async validateAttributesAndAbilities(tags) {
    try {
      for (const tag of tags) {
        const ability = await abilityInst.findOne({
          id: tag.ability,
        });
        if (!ability) {
          throw new errors.ValidationFailed(ResponseMessage.ABILITY_NOT_FOUND);
        }
        for (const attribute of tag.attributes) {
          const attr = await attributeInst.findOne({
            id: attribute,
            ability_id: tag.ability,
          });
          if (!attr) {
            throw new errors.ValidationFailed(
              ResponseMessage.ATTRIBUTE_NOT_FOUND
            );
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async uploadToVimeo(media, { max_duration }) {
    
  }
};
