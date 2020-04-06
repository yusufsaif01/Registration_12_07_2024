const userValidator = require("../middleware/validators").userValidator;
const UserRegistrationService = require('../services/UserRegistrationService');
const { checkAuthToken, checkTokenForAccountActivation } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const AuthService = require('../services/AuthService');

module.exports = (router) => {

    router.post('/register', userValidator.createAPIValidation, function (req, res) {
        const serviceInst = new UserRegistrationService();
        responseHandler(req, res, serviceInst.memberRegistration(req.body));
    });

    router.post('/login', function (req, res) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.login(req.body.email, req.body.password));
    });

    router.post('/create-password', checkTokenForAccountActivation, function (req, res) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.createPassword(req.authUser, req.body.password, req.body.confirmPassword));
    });

    router.post('/reset-password', checkAuthToken, function (req, res) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.resetPassword(req.authUser, req.body.password, req.body.confirmPassword));
    });

    router.post('/logout', checkAuthToken, function (req, res) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.logout(req.authUser));
    });

    router.post('/forgot-password', function (req, res) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.forgotPassword(req.body.email));
    });

    router.post('/change-password', checkAuthToken, function (req, res) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.changePassword(req.authUser, req.body.old_password, req.body.new_password, req.body.confirm_password));
    });
};
