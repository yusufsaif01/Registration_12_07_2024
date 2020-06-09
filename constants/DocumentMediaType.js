class DocumentMediaType {
    static get IMAGE() {
        return 'image';
    }
    static get PDF() {
        return 'pdf';
    }
    static get ALLOWED_MEDIA_EXTENSIONS() {
        return [".jpg", ".jpeg", ".png",".pdf"];
    }
}

module.exports = DocumentMediaType