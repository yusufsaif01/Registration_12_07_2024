const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const UserProfileService = require('../services/UserProfileService');
const UserService = require('../services/UserService');
const userValidator = require("../middleware/validators").userValidator;
const FileService = require('../services/FileService');

/**
 *
 *
 * @param {*} router
 */
module.exports = (router) => {
    
    // router.post('/me', checkAuthToken, function(req,res, next){
    //     const _serviceInst = new UserProfileService();
    //     responseHandler(req, res, Promise.resolve(_serviceInst.toAPIResponse(req.authUser)));
    // });

    // router.patch('/update-profile', checkAuthToken, function(req,res, next){
         
    //     let token=req.body.token || req.header('authorization');
    //     const _serviceInst = new UserProfileService();
    //     if(delete req.body.token){
    //         responseHandler(req, res, _serviceInst.updateProfile(token, req.body)
    //         .then(() => {
    //             return _serviceInst.toAPIResponse(req.body);
    //         }
    //     ));
    //     }
    // });
    router.get('/profile',checkAuthToken, function (req, res) {
        let serviceInst = new UserService();
        let userServiceInst = new UserProfileService();
        // responseHandler(req, res, serviceInst.getDetails({ id: req.authUser.id }));
        responseHandler(req, res, serviceInst.getDetails({ id: req.authUser.id }).then((user) =>{
            return  userServiceInst.toAPIResponse(user)}));
    });
    
    router.put('/update-details',checkAuthToken,userValidator.updateDetailsAPIValidation,async function (req, res) {
        let serviceInst = new UserProfileService();
        let filesURL = {};
            const _fileInst = new FileService();
            let file_url = await _fileInst.uploadFile(req.files.file, "./credentials/", req.files.file.name);
        responseHandler(req, res, serviceInst.updateProfile({ id: req.authUser.id,updateValues: req.body }));
      
    });
    router.put('/update-bio',checkAuthToken,userValidator.updateBioAPIValidation, function (req, res) {
        let serviceInst = new UserProfileService();
        
        responseHandler(req, res, serviceInst.updateProfile({ id: req.authUser.id,updateValues: req.body }));
      
    });
    
    

};



