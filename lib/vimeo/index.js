const fs = require("fs");
const uploader = require("./uploader");
// const checkDuration = require("./operations/duration");

const VimeoApi = require("./api");
const config = require("../../config");

const apiInst = new VimeoApi({
  access_token: config.vimeo.access_token,
  client_id: config.vimeo.client_id,
  client_secret: config.vimeo.client_secret,
});

module.exports.uploadToVimeo = async (file) => {
  try {
    let uploadedFile = await uploader.handleUpload(file);
    // const duration = await checkDuration(uploadedFile.path);
    // console.log("Duration of the video is :", duration);

    const uri = await apiInst.upload(uploadedFile.path, {
      params: {
        name: "Video Title",
        description: "Video Description",
      },
    });

    await removeTempFile(uploadedFile.path);

    return Promise.resolve({
      uri: uri,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports.getVideoStatus = async (uri) => {
  try {
    const response = await apiInst.transcodingStatus(uri);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};
module.exports.getVideoInfo = async (uri) => {
  try {
    const response = await apiInst.get(uri);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

function removeTempFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        console.log("There was error in removing file :", path, err);
      }
      return resolve();
    });
  });
}
