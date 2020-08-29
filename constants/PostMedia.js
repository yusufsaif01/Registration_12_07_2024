class PostMedia {
  static get IMAGE() {
    return "image";
  }
  static get VIDEO() {
    return "video";
  }
  static get ALLOWED_MEDIA_EXTENSIONS() {
    return [".jpg", ".jpeg", ".png"];
  }

  static get ALLOWED_VIDEO_EXTENSIONS() {
    return [".mp4", ".avi", ".mkv"];
  }

  static get ALLOWED_MEDIA_TYPES() {
    return [this.IMAGE, this.VIDEO];
  }
}

module.exports = PostMedia;
