// Load dependencies
const express = require('express');
const SP = require("./index");

const app = express();
const configForLocal = {
    bucket_name: "./uploads",
    provider: "LOCAL"
};

const configForS3 = {
    provider: "S3",
    access_key_id: "",
    secret_access_key: "",
    region: "",
    bucket_name: "",
    bucket_acl: ""
};

const configForDO = {
    provider: "DIGITAL_OCEAN",
    access_key_id: "",
    secret_access_key: "",
    bucket_name: "",
    bucket_acl: "",
    spaceEndpoint:""
};


// adding middleware for file upload, it support all the options supported by express-fileupload
app.use(SP.addUploadMiddleware({
    limits: {
        fileSize: 25 * 1024 * 1024 // 15 MB
    },
    createParentPath: true,
    uriDecodeFileNames: true,
    safeFileNames: true,
    preserveExtension: 4,
    abortOnLimit: true,
    limitHandler: function (req, res, next) {
        next(new errors.MaxFileLimitExceeded(null, { size: "15 MB" }));
    },
    useTempFiles: true,
    tempFileDir: "/tmp",
    debug: false
}));

// Views in public directory
app.use(express.static('public'));

// Main, error and success views
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.get("/success", function (request, response) {
    response.sendFile(__dirname + '/public/success.html');
});

app.get("/error", function (request, response) {
    response.sendFile(__dirname + '/public/error.html');
});

app.post('/upload', async function (request, response) {
    try {
        let options = {
            allowed_extensions: [".png"],
            base_upload_path: __dirname,
            fileName: (fileName) => {
                let _filename = fileName.split(".");
                return "avatar/" + _filename[0] + new Date().getTime() + "." + _filename[1];
            }
        };

        let storageProvider = new SP(configForDO).getInstance();
        let uploadResponse = await storageProvider.uploadDocument(request.files["upload-test"], options);
        console.log("uploadResponse", uploadResponse);

        // fetching signed URL by file name, in case of DO and S3
        let url = await storageProvider.getSignedURL(uploadResponse.file_name);
        console.log("Signed URL", url);

        return response.redirect("/?status=success");
    } catch (e) {
        console.log(e);
        return response.redirect("/?status=fail&message=" + e.message);
    }

});

app.listen(3001, function () {
    console.log('Server listening on port 3001.');
});