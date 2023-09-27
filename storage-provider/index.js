const S3 = require("./providers/S3");
const DigitalOcean = require("./providers/DigitalOcean");
const LocalStorage = require("./providers/LocalStorage");
const expressFileUpload = require("express-fileupload");
const path = require("path");
class StorageProvider {
    constructor(storageConfig) {
        this.config = storageConfig || { path: "./uploads", provider: "LOCAL" };
    }

    /**
     * file: <Buffer>
     * options: {
     *      bucket_name: string
     *      filename :(filename)=>{},
     *      allowed_extensions:[],
     *      file_acl: string,
     *      base_upload_path: string <__dirname>
     * }
     * 
     */
    async uploadDocument(file, options) {
        let response = await this.getInstance().uploadDocument(file, options);
        return response;
    }

    static addUploadMiddleware(options) {
        return (req, res, next) => {
            return expressFileUpload(options)(req, res, next);
        }
    }

    getInstance() {
        let instance = null;
        switch (String(this.config.provider).toUpperCase()) {
            case "S3":
                instance = new S3(this.config);
                break;

            case "DIGITAL_OCEAN":
                instance = new DigitalOcean(this.config);
                break;

            default:
                instance = new LocalStorage(this.config);
                break;
        }
        return instance;
    }
}

module.exports = StorageProvider;