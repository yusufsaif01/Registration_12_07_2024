const authValidator = require('../middleware/validators/authValidator');
const userValidator = require("../middleware/validators").userValidator;
const UserRegistrationService = require('../services/UserRegistrationService');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const AuthService = require('../services/AuthService');
const AuthUtility = require('../db/utilities/AuthUtility');
const UserService = require('../services/UserService');

/**
 *
 *
 * @param {*} router
 */
module.exports = (router) => {

    router.post('/register', userValidator.createAPIValidation, function (req, res, next) {
        const serviceInst = new UserRegistrationService();

        responseHandler(req, res, serviceInst.memberRegistration(req.body).then(serviceInst.toAPIResponse));
    });

    router.get('/activate', function (req, res, next) {

        let authUtilityInst = new AuthUtility();
        let serviceInst = new UserService();
        let token = req.query.token;
        token = "Bearer " + token;
        responseHandler(req, res, authUtilityInst.getUserByToken(token).then((user) => {
            return serviceInst.update({ id: user.id, updateValues: { is_email_verified: true } }).then(() => {
                return Promise.resolve()
            })
        }));

    })

    router.post('/login', function (req, res, next) {
        const authServiceInst = new AuthService();

        responseHandler(req, res, authServiceInst.login(req.body.email, req.body.password));
    });
    router.post('/create-password', checkAuthToken, function (req, res, next) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.createPassword(req.authUser, req.body.password, req.body.confirmPassword));
    })

    router.post('/logout', checkAuthToken, function (req, res, next) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.logout(req.authUser));
    });

    router.post('/forgot-password', function (req, res, next) {
        const authServiceInst = new AuthService();
        const userServiceInst = new UserRegistrationService();
        responseHandler(req, res, authServiceInst.forgotPassword(req.body.email).then((user) => {
            return userServiceInst.toAPIResponse(user)
        }));
    });

    router.post('/change-password', checkAuthToken, function (req, res, next) {
        const authServiceInst = new AuthService();
        responseHandler(req, res, authServiceInst.resetPassword(req.authUser, req.body.old_password, req.body.new_password));
    });

};
