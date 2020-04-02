const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const UserProfileService = require('../services/UserProfileService');
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
    
  
    router.get('/profile',checkAuthToken, function (req, res) {
        let serviceInst = new UserService();
        let userServiceInst = new UserProfileService();
        if(!req.authUser.is_email_verified)
        {
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("email is not verified")));
          
        }
        responseHandler(req, res, serviceInst.getDetails({ id: req.authUser.id }).then((user) =>{
            return  userServiceInst.toAPIResponse(user)}));
    });
    
    router.put('/update-details',checkAuthToken,userValidator.updateDetailsAPIValidation,async function (req, res) {
        let serviceInst = new UserProfileService();
        if(!req.authUser.is_email_verified)
        {
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("email is not verified")));
          
        }
        let filesURL = {};
            const _fileInst = new FileService();
            let file_url = await _fileInst.uploadFile(req.files.file, "./documents/", req.files.file.name); 
            console.log(req.files) 
        responseHandler(req, res, serviceInst.updateProfileDetails({ id: req.authUser.id,updateValues: req.body }));
      
    });
    router.put('/update-bio',checkAuthToken,userValidator.updateBioAPIValidation, function (req, res) {
        let serviceInst = new UserProfileService();
        if(!req.authUser.is_email_verified)
        {
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed("email is not verified")));
          
        } 
        responseHandler(req, res, serviceInst.updateProfileBio({ id: req.authUser.id,updateValues: req.body }));
      
    });
    
    

};



