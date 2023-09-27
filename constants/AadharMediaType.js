class AadharMediaType {
    static get IMAGE() {
        return 'image';
    }
    static get PDF() {
        return 'pdf';
    }
    static get ALLOWED_IMAGE_EXTENSIONS() {
        return [".jpg", ".jpeg", ".png"];
    }
    static get PDF_EXTENSION() {
        return [".pdf"];
    }
}

module.exports = AadharMediaType