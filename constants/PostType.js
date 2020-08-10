module.exports = class PostType {
  static get TIMELINE_POST() {
    return "timeline_post";
  }
  static get LEARNING_OR_TRAINING_VIDEO() {
    return "learning_or_training_video";
  }
  static get MATCH_VIDEOS() {
    return "match_videos";
  }

  static get ALLOWED_POST_TYPES() {
    return [
      this.TIMELINE_POST,
      this.LEARNING_OR_TRAINING_VIDEO,
      this.MATCH_VIDEOS,
    ];
  }
};
