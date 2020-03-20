module.exports = {
    uploadPath: {
        doc: 'file upload base path',
        format: String,
        default: './uploads/',
        env: "FILE_UPLOAD_UPLOAD_PATH",
        arg: "file_upload_upload_path"
    },
    debug: {
        doc: 'enable debug',
        format: Boolean,
        default: false,
        env: "FILE_UPLOAD_DEBUG",
        arg: "file_upload_debug"
    }
};
