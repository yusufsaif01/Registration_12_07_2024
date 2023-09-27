const VideoQueueUtility = require("../db/utilities/VideoQueueUtility");

module.exports = class VideoQueueService {
  constructor() {
    this.videoUtilityInst = new VideoQueueUtility();
  }

  async addToQueue(payload) {
    try {
      return await this.videoUtilityInst.insert(payload);
    } catch (error) {
      console.log("Error adding video to the queue", error);
    }
  }

  getProcessingCursor() {
    try {
      return this.videoUtilityInst.cursor({ is_deleted: false });
    } catch (error) {
      console.log("Unable to fetch videos list for processing");
    }
  }

  async removeItem (id) {
    try {
        await this.videoUtilityInst.updateOne({
            id: id
        }, {
            is_deleted: true
        })
    } catch (error) {
        console.log("unable to delete the video queue item from db", error);
    }
  }
};
