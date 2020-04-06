const path = require("path");
const uuidv4 = require('uuid/v4');
const Promise = require("bluebird");
const errors = require("../errors");
const config = require("../config");
const fs = require('fs');

class FileService {

    uploadFile(file, folder, fileName, allowedExt = []) {
        let ext = path.extname(file.name);
        if (allowedExt.length > 0) {
            if (!allowedExt.includes(ext)) {
                console.log(allowedExt, ext);
                return Promise.reject(new errors.InvalidFile("Invalid file " + file.name + ", allowed extensions - " + allowedExt));
            }
        }
        if (!fileName) {
            fileName = uuidv4() + ext;
        }
        return new Promise((resolve, reject) => {
            let folderPath, finalPath, url;
            try {
                folderPath = path.normalize(path.join(__basedir, config.fileupload.uploadPath, folder));
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }
                finalPath = path.join(folderPath, fileName);
                url = path.join("/", folder, fileName);
            } catch (err) {
                console.log(err);
                return Promise.reject(new errors.UploadError());
            }
            file.mv(finalPath, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve(url);
            });
        });
    }
}

module.exports = FileService;

