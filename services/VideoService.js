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
const config = require("../config");
const VideoResponseMapper = require("../dataModels/responseMapper/VideoResponseMapper");
const LoginUtility = require("../db/utilities/LoginUtility");
const FootPlayerUtility = require("../db/utilities/FootPlayerUtility");
const PostType = require("../constants/PostType");
const FootPlayerStatus = require("../constants/FootPlayerStatus");

const abilityInst = new AbilityUtility();
const attributeInst = new AttributeUtility();
const postInst = new PostUtility();
const loginInst = new LoginUtility();
const footPlayerInst = new FootPlayerUtility();

module.exports = class VideoService {
  constructor() {
    this.videoQueueService = new VideoQueueService();
  }

  async uploadVideo(authUser, type, { tags, media, others }) {
    try {
      const videoOptions = this.getUploadOptions(authUser, type);
      const tagsData = await this.validateAttributesAndAbilities(tags);
      const videoResponse = await this.uploadToVimeo(media, videoOptions);
      const postDocument = await this.addPost(
        authUser,
        type,
        tagsData,
        videoResponse,
        others
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
    try {
      const abilityIdArray = tags.map((tag) => tag.ability);
      let abilitiesDB = await abilityInst.aggregate([
        { $match: { id: { $in: abilityIdArray } } },
        {
          $lookup: {
            from: "attributes",
            localField: "id",
            foreignField: "ability_id",
            as: "attributes",
          },
        },
        {
          $project: { _id: 0, id: 1, name: 1, attributes: { id: 1, name: 1 } },
        },
      ]);

      let mappedData = {};
      abilitiesDB.forEach((abilities) => {
        mappedData[abilities.id] = abilities;
      });

      return tags.map((tag) => {
        if (!mappedData[tag.ability]) {
          return null;
        }

        const ability = mappedData[tag.ability];

        return {
          ability_id: ability.id,
          ability_name: ability.name,
          attributes: ability.attributes
            .filter((attr) => tag.attributes.includes(attr.id))
            .map((filteredAttr) => ({
              attribute_id: filteredAttr.id,
              attribute_name: filteredAttr.name,
            })),
        };
      });
    } catch (error) {
      console.log("Error in processing mapped attributes", error);
      throw new errors.ValidationFailed(ResponseMessage.ERROR_IN_TAGS);
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

  async addPost(authUser, type, dataTags, videoResponse, others) {
    try {
      const data = {
        posted_by: authUser.user_id,
        create_at: Date.now(),
        media: {
          media_url: videoResponse.link,
          media_thumbnail: {
            url: config.vimeo.video_in_processing_thumbnail,
          },
          media_type: PostMedia.VIDEO,
        },
        status: PostStatus.PENDING,
        post_type: type,
        meta: {
          abilities: dataTags,
          others: others,
        },
      };
      const document = await postInst.insert(data);
      return Promise.resolve(document);
    } catch (error) {
      console.log("There was error in adding post", error);
      return Promise.reject(error);
    }
  }

  async updateVideo(postId, authUser, { tags, others }) {
    try {
      const tagsData = await this.validateAttributesAndAbilities(tags);
      const $where = {
        id: postId,
        posted_by: authUser.user_id,
        "media.media_type": PostMedia.VIDEO,
      };
      await this.getVideo($where);
      await postInst.updateOne($where, {
        "meta.abilities": tagsData,
        "meta.others": others,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getVideo(query) {
    try {
      const video = await postInst.findOne(query);

      if (!video) {
        throw new errors.NotFound(ResponseMessage.VIDEO_NOT_FOUND);
      }

      return video;
    } catch (error) {
      console.log("Error getting video", error);
      throw error;
    }
  }

  async getVideosList({ query, pagination }) {
    try {
      const skipCount = (pagination.page_no - 1) * pagination.limit;
      const options = { limit: pagination.limit, skip: skipCount };

      const $where = await this.listMatchCriteria(query);

      if (query.others) {
        const others = query.others.split(",");
        $where["meta.others"] = {
          $in: others,
        };
      }
      if (query.attribute) {
        const attribute = query.attribute.split(",");
        $where["meta.abilities.attributes.attribute_name"] = {
          $in: attribute,
        };
      }

      const pipelines = [
        {
          $match: $where,
        },
        {
          $sort: { "post.createdAt": -1 },
        },
        { $skip: options.skip },
        { $limit: options.limit },
      ];

      const posts = await postInst.aggregate(pipelines);

      const totalCount = await postInst.countList($where);

      return {
        total: totalCount,
        records: VideoResponseMapper.map(posts),
      };
    } catch (error) {
      console.log("Error in getVideosList() of VideoService", error);
      return Promise.reject(error);
    }
  }

  async listMatchCriteria(query) {
    try {
      const defaults = {
        posted_by: query.user_id,
        post_type: query.post_type,
        "media.media_type": query.media_type,
      };

      if (query.mode == "public") {
        return await this.getPublicMatchCriteria(query);
      }

      return defaults;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getPublicMatchCriteria(query) {
    try {
      const defaults = {
        posted_by: query.user_id,
        post_type: query.post_type,
        "media.media_type": query.media_type,
      };

      if (query.user_id == query.authUser.user_id) {
        return defaults;
      }

      defaults.status = PostStatus.PUBLISHED

      const userLoginDetails = await this.getUserLogin(query.user_id);

      if ([ROLE.CLUB, ROLE.ACADEMY].includes(userLoginDetails.role)) {
        const ifExists = await footPlayerInst.findOne({
          sent_by: userLoginDetails.user_id,
          'send_to.user_id': query.authUser.user_id,
          status: FootPlayerStatus.ADDED
        });

        if (!ifExists && query.post_type != PostType.TIMELINE) {
          // defaults.post_type = PostType.TIMELINE
          throw new errors.NotFound();
        }
      }
      return defaults;

    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getUserLogin(userId) {
    const user = await loginInst.findOne({ user_id: userId });
    if (!user) {
      throw new errors.NotFound(ResponseMessage.USER_NOT_FOUND);
    }
    return user;
  }
};
