class StorageProviderLocal {
    static get UPLOAD_OPTIONS() {
        return {
            allowed_extensions: [],
            base_upload_path: __basedir,
            fileName: (fileName) => {
                let _filename = fileName.split(".");
                return "documents/" + _filename[0] + new Date().getTime() + "." + _filename[1];
            }
        };
    }
}

module.exports = StorageProviderLocal