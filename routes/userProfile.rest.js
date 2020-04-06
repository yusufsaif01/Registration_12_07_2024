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
        try {
            let serviceInst = new UserService();
            let userServiceInst = new UserProfileService();

            responseHandler(req, res, serviceInst.getDetails(req.authUser).then((user) => {
                return userServiceInst.toAPIResponse(user);
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }

    });

    router.put('/update-details', checkAuthToken, userValidator.updateDetailsAPIValidation, async function (req, res) {
        try {
            let serviceInst = new UserProfileService();
            let reqObj = await serviceInst.uploadProfileDocuments(req.body, req.files);

            responseHandler(req, res, serviceInst.updateProfileDetails({
                member_type: req.authUser.member_type,
                id: req.authUser.user_id,
                updateValues: reqObj
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });

    router.put('/update-bio', checkAuthToken, userValidator.updateBioAPIValidation, async function (req, res) {
        try {
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
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });
};



