const path = require("path");
const fs = require("fs");
const errors = require('../errors');
class LocalStorage {
    constructor(config) {
        this.uploadFilePath = config.bucket_name;
    }

    uploadDocument(file, options) {
        // validate file extension
        this.validateFileExtension(file.name, options.allowed_extensions);

        let fileName = options.fileName ? options.fileName(file.name) : path.basename(file.name);

        return new Promise((resolve, reject) => {
            let folderPath, finalPath, url;
            try {
                folderPath = path.normalize(path.join(process.cwd(), this.uploadFilePath, path.dirname(fileName)));

                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }
                finalPath = path.join(folderPath, path.basename(fileName));
                url = path.join("/", this.uploadFilePath, fileName);
            } catch (err) {
                console.log(err);
                return reject(err);
            }
            file.mv(finalPath, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    "file_name": fileName,
                    "url": url
                });
            });
        });
    }

    validateFileExtension(fileName = "", allowedExt = []) {
        let fileExtension = path.extname(fileName);
        if (allowedExt.length > 0 && !allowedExt.includes(fileExtension))
            throw new errors.InvalidFile("Invalid file " + fileName + ", allowed extensions - " + allowedExt);
        return true;
    }
}

module.exports = LocalStorage;