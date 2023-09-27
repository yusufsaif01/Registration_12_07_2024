module.exports = class PostStatus {
  static get PENDING() {
    return "pending";
  }
  static get PUBLISHED() {
    return "published";
  }

  static get AVAILABLE_POST_STATUS() {
    return [this.PENDING, this.PUBLISHED];
  }
};
