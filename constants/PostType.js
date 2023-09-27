module.exports = class PostType {
  static get TIMELINE() {
    return "timeline";
  }
  static get LEARNING_OR_TRAINING() {
    return "learning_or_training";
  }
  static get MATCH() {
    return "match";
  }

  static get ALLOWED_POST_TYPES() {
    return [
      this.TIMELINE,
      this.LEARNING_OR_TRAINING,
      this.MATCH,
    ];
  }
};
