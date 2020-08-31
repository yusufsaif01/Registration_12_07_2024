const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const config = require("../../../config");

const options = {
  uploadPath: path.join(process.cwd(), config.vimeo.upload_path),
  randomFileName() {
    return crypto.randomBytes(10).toString("hex");
  },
};

// create directory if not exists.
if (!fs.existsSync(options.uploadPath)) {
  fs.mkdirSync(options.uploadPath, { recursive: true });
}

module.exports.handleUpload = (file) => {
  const fullPath = path.join(options.uploadPath, options.randomFileName());
  return new Promise((resolve, reject) => {
    file.mv(fullPath, (err) => {
      if (err) reject(err);
      return resolve({
        path: fullPath,
      });
    });
  });
};
