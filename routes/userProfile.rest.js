const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const UserProfileService = require('../services/UserProfileService');
const LoginUtility = require('../db/utilities/LoginUtility');
const UserService = require('../services/UserService');
const userValidator = require("../middleware/validators").userValidator;
const FileService = require('../services/FileService');
const errors = require("../errors");

module.exports = (router) => {

    router.get('/profile', checkAuthToken, async function (req, res) {
        let serviceInst = new UserService();
        let userServiceInst = new UserProfileService();

        responseHandler(req, res, serviceInst.getDetails(req.authUser).then((user) => {
            return userServiceInst.toAPIResponse(user);
        }));
    });

    router.put('/update-details', checkAuthToken, userValidator.updateDetailsAPIValidation, async function (req, res) {
        let serviceInst = new UserProfileService();

        let reqObj = req.body;
        if (req.files) {
            reqObj.documents = [];
            const _fileInst = new FileService();
            if (req.files.aadhar) {
                let file_url = await _fileInst.uploadFile(req.files.aadhar, "./documents/", req.files.aadhar.name);
                reqObj.documents.push({ link: file_url, type: 'aadhar' });
            }
            if (req.files.aiff) {
                let file_url = await _fileInst.uploadFile(req.files.aiff, "./documents/", req.files.aiff.name);
                reqObj.documents.push({ link: file_url, type: 'aiff' });
            }
            if (req.body.document_type && req.files.document) {
                let file_url = await _fileInst.uploadFile(req.files.document, "./documents/", req.files.document.name);
                reqObj.documents.push({ link: file_url, type: req.body.document_type });
            }
        }

        if (req.body.contact_person) {
            try {
                reqObj.contact_person = JSON.parse(req.body.contact_person);
            } catch (e) {
                console.log(e);
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("Invalid value for contact_persons")));
            }
        }

        if (req.body.trophies) {
            try {
                reqObj.trophies = JSON.parse(req.body.trophies);
            } catch (e) {
                console.log(e);
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("Invalid value for trophies")));
            }
        }

        responseHandler(req, res, serviceInst.updateProfileDetails({
            member_type: req.authUser.member_type,
            id: req.authUser.user_id,
            updateValues: reqObj
        }));

    });

    router.put('/update-bio', checkAuthToken, userValidator.updateBioAPIValidation, async function (req, res) {
        let serviceInst = new UserProfileService();
        let reqObj = req.body;

        if (req.files) {
            const _fileInst = new FileService();
            if (req.files.avatar) {
                let avatar_url = await _fileInst.uploadFile(req.files.avatar, "./documents/", req.files.avatar.name);
                reqObj.avatar_url = avatar_url;
            }
        }
        responseHandler(req, res, serviceInst.updateProfileBio({
            member_type: req.authUser.member_type,
            id: req.authUser.user_id,
            updateValues: reqObj
        }));
    });
};



