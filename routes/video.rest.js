const { checkAuthToken } = require("../middleware/auth");
const responseHandler = require("../ResponseHandler");
const VideoService = require("../services/VideoService");
const PostService = require("../services/PostService");

const videoServiceInst = new VideoService();
const postServiceInst = new PostService();

const {
  middleware: validatePostType,
  userCanUploadVideo,
  validateData,
  checkUploadedVideo,
} = require("../middleware/validators/postTypeValidator");
const {
  postListQueryValidation,
} = require("../middleware/validators/postValidator");

/**
 *
 * /video/match_videos (X)
 * /video?type=match_videos [POST|GET]
 *
 */

module.exports = (router) => {
  router.post(
    "/video",
    checkAuthToken,
    validatePostType,
    userCanUploadVideo,
    checkUploadedVideo,
    validateData,
    async (req, res, next) => {
      const { type } = req.query;

      const reqBody = {
        tags: req.body.tags,
        media: req.files.media,
      };

      try {
        return responseHandler(
          req,
          res,
          videoServiceInst.uploadVideo(req.authUser, type, reqBody)
        );
      } catch (error) {
        return responseHandler(req, res, Promise.reject(error));
      }
    }
  );

  router.get(
    "/video",
    checkAuthToken,
    validatePostType,
    postListQueryValidation,
    (req, res, next) => {
      const { type } = req.query;

      let paginationOptions = {
        page_no: req.query && req.query.page_no ? req.query.page_no : 1,
        limit:
          req.query && req.query.page_size ? Number(req.query.page_size) : 10,
      };

      let commentOptions = {
        comments:
          req.query && req.query.comments ? Number(req.query.comments) : 0,
      };

      let filters = {
        type,
        attribute: req.query.attribute ? req.query.attribute : null,
      };

      responseHandler(
        req,
        res,
        postServiceInst.getPostsList({
          paginationOptions,
          commentOptions,
          user_id: req.authUser.user_id,
          filters,
        })
      );
    }
  );
};
