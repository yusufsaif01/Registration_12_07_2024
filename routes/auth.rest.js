const authValidator      = require('../middleware/validators/authValidator');
const userValidator = require("../middleware/validators").userValidator;
const UserRegistrationService     = require('../services/UserRegistrationService');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const AuthService = require('../services/AuthService');

/**
 *
 *
 * @param {*} router
 */
module.exports = (router) => {    

    router.post('/register', userValidator.createAPIValidation,function(req, res, next){
        const serviceInst = new UserRegistrationService();
        const { user_id , name,dob,email,password,username,state,country,phone} = req.body;
        responseHandler(req, res, serviceInst.memberRegistration({ user_id , name,dob,email,password,username,state,country,phone }).then(serviceInst.toAPIResponse));
    });

    router.post('/login', function(req, res, next){
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.login(req.body.username, req.body.password));
    });

    router.post('/logout', checkAuthToken, function(req, res, next){
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.logout(req.authUser));
    });

    router.post('/forgot-password', function(req, res, next){
        const authServiceInst = new AuthService();
        const userServiceInst = new UserRegistrationService();
        responseHandler(req, res, authServiceInst.forgotPassword(req.body.email).then((user) =>{
            return  userServiceInst.toAPIResponse(user)
        }));
    });

    router.post('/change-password', checkAuthToken, function(req, res, next){        
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.resetPassword(req.authUser, req.body.old_password, req.body.new_password));
    });

};
