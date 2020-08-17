const VideoQueueService = require("../../services/VideoQueueService");
const vimeo = require("../../lib/vimeo");
const PostUtility = require("../../db/utilities/PostUtility");
const POST_STATUS = require("../../constants/PostStatus");

const videoQueueInst = new VideoQueueService();
const postUtilityInst = new PostUtility();

module.exports = async () => {
  (await videoQueueInst.getProcessingCursor()).eachAsync(async (video) => {
    try {
      console.log("[+] Checking", video.uri);
      const videoResponse = await vimeo.getVideoStatus(video.uri);
      console.log("[+] ", video.uri, ":", videoResponse.transcode.status);
      if (videoResponse.transcode.status == "complete") {
        const videoThumbnail = videoResponse.pictures.sizes.filter((size) =>
          [200, 960, 1920].includes(size.width)
        );

        await postUtilityInst.updateOne(
          {
            id: video.post_id,
            status: POST_STATUS.PENDING,
          },
          {
            status: POST_STATUS.PUBLISHED,
            "media.media_thumbnail.sizes": videoThumbnail,
          }
        );
        await videoQueueInst.removeItem(video.id);
      }
    } catch (error) {
      console.log("Unable to process the video", video.uri, error);
    }
  });
};
