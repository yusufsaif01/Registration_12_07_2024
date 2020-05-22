class PostMedia {
    static get ALLOWED_MEDIA_TYPE() {
        return "image";
    }
    static get ALLOWED_MEDIA_EXTENSIONS() {
        return [".jpg", ".jpeg", ".png"];
    }
}

module.exports = PostMedia