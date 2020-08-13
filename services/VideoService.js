const POST_TYPE = require("../constants/PostType");
const ROLE = require("../constants/Role");
const AbilityUtility = require("../db/utilities/AbilityUtility");
const AttributeUtility = require("../db/utilities/AttributeUtility");
const errors = require("../errors");
const ResponseMessage = require("../constants/ResponseMessage");
const vimeoLib = require("../lib/vimeo");
const PostUtility = require("../db/utilities/PostUtility");
const PostMedia = require("../constants/PostMedia");
const PostStatus = require("../constants/PostStatus");
const VideoQueueService = require("./VideoQueueService");

const abilityInst = new AbilityUtility();
const attributeInst = new AttributeUtility();
const postInst = new PostUtility();

module.exports = class VideoService {
  constructor() {
    this.videoQueueService = new VideoQueueService();
  }

  async uploadVideo(authUser, type, { tags, media }) {
    try {
      const videoOptions = this.getUploadOptions(authUser, type);
      const tagsData = await this.validateAttributesAndAbilities(tags);
      const videoResponse = await this.uploadToVimeo(media, videoOptions);
      const postDocument = await this.addPost(
        authUser,
        type,
        tagsData,
        videoResponse
      );
      await this.videoQueueService.addToQueue({
        post_id: postDocument.id,
        uri: videoResponse.uri,
      });
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

  /**
   * Check for abilities and attributes
   *
   * validates and return the expected data to be inserted into post.
   *
   * @param {array} tags
   */
  async validateAttributesAndAbilities(tags) {
    const data = [];

    try {
      for (const tag of tags) {
        let eachTag = {};

        const ability = await abilityInst.findOne(
          {
            id: tag.ability,
          },
          { id: 1, name: 1 }
        );
        if (!ability) {
          throw new errors.ValidationFailed(ResponseMessage.ABILITY_NOT_FOUND);
        }
        eachTag = {
          ability_id: ability.id,
          ability_name: ability.name,
          attributes: [],
        };
        for (const attribute of tag.attributes) {
          const attr = await attributeInst.findOne(
            {
              id: attribute,
              ability_id: tag.ability,
            },
            { id: 1, name: 1 }
          );
          if (!attr) {
            throw new errors.ValidationFailed(
              ResponseMessage.ATTRIBUTE_NOT_FOUND
            );
          }
          eachTag.attributes.push({
            attribute_id: attr.id,
            attribute_name: attr.name,
          });
        }
        data.push(eachTag);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async uploadToVimeo(media, { max_duration }) {
    try {
      const { uri } = await vimeoLib.uploadToVimeo(media, {
        maxDuration: max_duration,
      });
      const videoInfo = await vimeoLib.getVideoInfo(uri);

      const payload = {
        uri: videoInfo.uri,
        link: videoInfo.link,
        embedCode: videoInfo.embed.html,
      };

      return payload;
    } catch (error) {
      console.log("There was an error in uploading video to Vimeo server");
      return Promise.reject(error);
    }
  }

  async addPost(authUser, type, dataTags, videoResponse) {
    try {
      const data = {
        posted_by: authUser.user_id,
        create_at: Date.now(),
        media: {
          media_url: videoResponse.link,
          media_thumbnail: "",
          media_type: PostMedia.VIDEO,
        },
        status: PostStatus.PENDING,
        post_type: type,
        meta: {
          abilities: dataTags,
        },
      };
      const document = await postInst.insert(data);
      return Promise.resolve(document);
    } catch (error) {
      console.log("There was error in adding post", error);
      return Promise.reject(error);
    }
  }
};
