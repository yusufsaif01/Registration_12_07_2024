const VideoQueue = require("../schemas/VideoQueue");
const BaseUtility = require("./BaseUtility");

class VideoQueueUtility extends BaseUtility {
  constructor() {
    super(VideoQueue);
  }
}

module.exports = VideoQueueUtility;
