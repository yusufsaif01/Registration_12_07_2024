const { checkAuthToken } = require("../middleware/auth");
const responseHandler = require("../ResponseHandler");
const VideoService = require("../services/VideoService");

const videoServiceInst = new VideoService();

const {
  middleware: validatePostType,
  userCanUploadVideo,
  validateData,
  checkUploadedVideo
} = require("../middleware/validators/postTypeValidator");

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
        media: 'req.body.tags',
      }

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
};
