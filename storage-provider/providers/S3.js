// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const errors = require('../errors');
class S3 {
    /**
     * {
     *   access_key_id,
     *   secret_access_key,
     *   region,
     *   bucket_name,
     *   bucket_acl
     * }
     * 
     */
    constructor(config) {
        this.config = config;
        AWS.config.setPromisesDependency();

        AWS.config.update({
            accessKeyId: this.config.access_key_id,
            secretAccessKey: this.config.secret_access_key,
            region: this.config.region
        });

        // Create S3 service object
        this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    }

    async getAllBuckets() {
        try {
            // Call S3 to list the buckets
            let response = await this.s3.listBuckets();
            return response.Buckets;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async createBucket(bucket_name = null) {
        try {
            // Create the parameters for calling createBucket
            var bucketParams = {
                Bucket: bucket_name || this.config.bucket_name || "",
                ACL: this.config.bucket_acl || 'public-read'
            };

            // call S3 to create the bucket
            let response = await this.s3.createBucket(bucketParams)
            console.log("Success", response.Location);
            return response.Location;

        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    }

    uploadDocument(file, options = {}) {
        try {
            // validate file extension
            this.validateFileExtension(file.name, options.allowed_extensions);

            // call S3 to retrieve upload file to specified bucket
            const uploadParams = {
                Bucket: options.bucket_name || this.config.bucket_name || "",
                Key: options.fileName ? options.fileName(file.name) : path.basename(file.name),
                Body: "",
                ACL: options.file_acl || this.config.bucket_acl || "public-read"
            };

            const fileBuffer = fs.readFileSync(file.tempFilePath);
            uploadParams.Body = fileBuffer;

            return new Promise((resolve, reject) => {
                // call S3 to retrieve upload file to specified bucket
                this.s3.putObject(uploadParams, async (err, data) => {
                    if (err)
                        return reject(err);
                    else {
                        let signedURL = await this.getSignedURL(uploadParams.Key, options.bucket_name);
                        return resolve({
                            "file_name": uploadParams.Key,
                            "url": signedURL
                        });
                    }
                });
            });
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    }

    _getFileName(fileName) {
        return `https://${this.config.bucket_name}.s3-${this.config.region || ''}.amazonaws.com/${fileName}`;
    }

    async getAllDocuments(bucket_name = null) {
        try {
            // Create the parameters for calling listObjects
            var bucketParams = {
                Bucket: bucket_name || this.config.bucket_name || ""
            };

            // Call S3 to obtain a list of the objects in the bucket
            let response = await this.s3.listObjects(bucketParams);
            return response;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    }

    async getDocument(file_name = "", bucket_name = null) {
        try {
            var params = {
                Bucket: bucket_name || this.config.bucket_name || "",
                Key: file_name
            };

            let response = await this.s3.getObject(params);
            return response;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    }

    async deleteBucket(bucket_name = null) {
        try {
            // Create params for S3.deleteBucket
            var bucketParams = {
                Bucket: bucket_name || this.config.bucket_name || "",
            };

            // Call S3 to delete the bucket
            let response = await this.s3.deleteBucket(bucketParams);
            console.log("Success", response);
            return response;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    }

    getSignedURL(file_name, bucket_name = null) {
        try {
            return new Promise((res) => {
                var params = {
                    Bucket: bucket_name || this.config.bucket_name || "",
                    Key: file_name,
                    Expires: this.config.url_expiry_time || 900 // default 900 seconds = 15 minutes
                };
                var url = this.s3.getSignedUrl('getObject', params);
                return res(url);
            });
        } catch (error) {
            throw error;
        }
    }

    validateFileExtension(fileName = "", allowedExt = []) {
        let fileExtension = path.extname(fileName);
        if (allowedExt.length > 0 && !allowedExt.includes(fileExtension))
            throw new errors.InvalidFile("Invalid file " + fileName + ", allowed extensions - " + allowedExt);
        return true;
    }
}
module.exports = S3;