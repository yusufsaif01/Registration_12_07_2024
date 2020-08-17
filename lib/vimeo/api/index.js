const Vimeo = require("vimeo").Vimeo;

class VimeoApi {
  constructor({ client_id, client_secret, access_token }) {
    this.client = new Vimeo(client_id, client_secret, access_token);
  }

  upload(filePath, params = {}) {
    return new Promise((resolve, reject) => {
      this.client.upload(
        filePath,
        params,
        (uri) => resolve(uri),
        (bytesUploaded, bytesTotal) => {
          var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(bytesUploaded, bytesTotal, percentage + "%");
        },
        (err) => reject(err)
      );
    });
  }

  updateVideo(uri, data = {}) {
    return new Promise((resolve, reject) => {
      this.client.request(
        {
          method: "PATCH",
          path: uri,
          params: data,
        },
        function (error, body, statusCode, headers) {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        }
      );
    });
  }

  getPublicLink(uri) {
    return new Promise((resolve, reject) => {
      this.client.request(uri + "?fields=link", function (
        error,
        body,
        statusCode,
        headers
      ) {
        if (error) {
          return reject(error);
        }
        return resolve(body.link);
      });
    });
  }

  transcodingStatus(uri) {
    return new Promise((resolve, reject) => {
      this.client.request(uri + "?fields=transcode.status,link,pictures.sizes", function (
        error,
        body,
        statusCode,
        headers
      ) {
        if (error) {
          return reject(error);
        }
        return resolve(body);
      });
    });
  }
  get(uri) {
    return new Promise((resolve, reject) => {
      this.client.request(uri, function (error, body, statusCode, headers) {
        if (error) {
          return reject(error);
        }
        return resolve(body);
      });
    });
  }
}

module.exports = VimeoApi;
