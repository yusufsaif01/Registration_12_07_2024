const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const UserProfileService = require('../services/UserProfileService');
const LoginUtility = require('../db/utilities/LoginUtility');
const UserService = require('../services/UserService');
const userValidator = require("../middleware/validators").userValidator;
const FileService = require('../services/FileService');
const errors = require("../errors");

/**
 *
 *
 * @param {*} router
 */
module.exports = (router) => {
    router.get('/profile', checkAuthToken, async function (req, res) {
        let serviceInst = new UserService();
        let userServiceInst = new UserProfileService();
        let loginUtilityInst = new LoginUtility();
        let loginDetails = await loginUtilityInst.findOne({ user_id: req.authUser.user_id })
        if (!loginDetails.is_email_verified) {
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("email is not verified")));
        }
        responseHandler(req, res, serviceInst.getDetails(req.authUser.member_type, { id: req.authUser.id }).then((user) => {
            return userServiceInst.toAPIResponse(user)
        }));
    });

    router.put('/update-details', checkAuthToken, userValidator.updateDetailsAPIValidation, async function (req, res) {
        let serviceInst = new UserProfileService();
        let loginUtilityInst = new LoginUtility();

        let loginDetails = await loginUtilityInst.findOne({ user_id: req.authUser.user_id })
        if (!loginDetails.is_email_verified) {
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("email is not verified")));
        }
        let reqObj = req.body;
        if (req.files) {
            const _fileInst = new FileService();
            if (req.files.aadhar) {
                let file_url = await _fileInst.uploadFile(req.files.aadhar, "./documents/", req.files.aadhar.name);
                let documents = [{ link: file_url, type: 'aadhar' }]
                reqObj.documents = documents;
            }
            if (req.files.aiff) {
                let file_url = await _fileInst.uploadFile(req.files.aiff, "./documents/", req.files.aiff.name);
                let documents = [{ link: file_url, type: 'aiff' }]
                reqObj.documents = documents;
            }
            if (req.body.document_type) {
                let file_url = await _fileInst.uploadFile(req.files.document, "./documents/", req.files.document.name);
                let documents = [{ link: file_url, type: req.body.document_type }]
                reqObj.documents = documents;
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
                let trophies = JSON.parse(req.body.trophies);
                reqObj.trophies = trophies;
            } catch (e) {
                console.log(e);
                return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("Invalid value for trophies")));
            }
        }
        responseHandler(req, res, serviceInst.updateProfileDetails({
            member_type: req.authUser.member_type,
            id: req.authUser.id,
            updateValues: reqObj
        }));

    });
    router.put('/update-bio', checkAuthToken, userValidator.updateBioAPIValidation, async function (req, res) {
        let serviceInst = new UserProfileService();
        let reqObj = req.body;
        let loginUtilityInst = new LoginUtility();
        let loginDetails = await loginUtilityInst.findOne({ user_id: req.authUser.user_id })
        if (!loginDetails.is_email_verified) {
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("email is not verified")));
        }
        if (req.files) {
            const _fileInst = new FileService();
            if (req.files.avatar) {
                let avatar_url = await _fileInst.uploadFile(req.files.avatar, "./documents/", req.files.avatar.name);
                reqObj.avatar_url = avatar_url;
            }

        }

        responseHandler(req, res, serviceInst.updateProfileBio({ id: req.authUser.id, updateValues: reqObj }));

    });



};



