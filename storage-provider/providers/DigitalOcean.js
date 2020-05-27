const S3 = require("./S3");
const AWS = require('aws-sdk');
const path = require("path");

class DigitalOcean extends S3 {
    /**
     * {
     *   access_key_id,
     *   secret_access_key,
     *   region,
     *   bucket_name,
     *   bucket_acl,
     *   spaceEndpoint
     * }
     * 
     */
    constructor(config) {
        super(config);
        this.config = config;
        AWS.config.setPromisesDependency();

        AWS.config.update({
            endpoint: new AWS.Endpoint(this.config.spaceEndpoint),
            accessKeyId: this.config.access_key_id,
            secretAccessKey: this.config.secret_access_key,
            region: this.config.region
        });

        // Create S3 service object
        this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    }

    _getFileName(fileName) {
        return path.normalize(`https://${this.config.spaceEndpoint}/${this.config.bucket_name}/${fileName}`);
    }
}

module.exports = DigitalOcean;