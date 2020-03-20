const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const UserProfileService = require('../services/UserProfileService');

/**
 *
 *
 * @param {*} router
 */
module.exports = (router) => {
    
    router.post('/me', checkAuthToken, function(req,res, next){
        const _serviceInst = new UserProfileService();
        responseHandler(req, res, Promise.resolve(_serviceInst.toAPIResponse(req.authUser)));
    });

    router.patch('/update-profile', checkAuthToken, function(req,res, next){
        
        let token=req.body.token || req.header('authorization');
        const _serviceInst = new UserProfileService();
        if(delete req.body.token){
            responseHandler(req, res, _serviceInst.updateProfile(token, req.body)
            .then(() => {
                return _serviceInst.toAPIResponse(req.body);
            }
        ));
        }
    });

};



