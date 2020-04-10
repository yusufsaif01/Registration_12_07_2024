const Promise = require("bluebird");
const errors = require('../errors');
const config = require('../config');
const ActivityService = require('./ActivityService');
const AuthUtility = require('../db/utilities/AuthUtility');
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtility');
const PlayerUtility = require('../db/utilities/PlayerUtility');
const LoginUtility = require('../db/utilities/LoginUtility');
const ActivityUtility = require('../db/utilities/ActivityUtility');
const EmailService = require('./EmailService');
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const ACCOUNT = require('../constants/AccountStatus');

class AuthService {

    constructor() {
        this.authUtilityInst = new AuthUtility();
        this.playerUtilityInst = new PlayerUtility();
        this.loginUtilityInst = new LoginUtility();
        this.activityUtilityInst = new ActivityUtility();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();
        this.emailService = new EmailService();
    }

    async login(email, password) {
        try {
            await this.loginValidator(email, password);
            const loginDetails = await this.findByCredentials(email, password);

            ActivityService.loginActivity(loginDetails.user_id, "login");
            const tokenForAuthentication = await this.authUtilityInst.getAuthToken(loginDetails.user_id, email, loginDetails.member_type);
            await this.loginUtilityInst.updateOne({ user_id: loginDetails.user_id }, { token: tokenForAuthentication });

            return { ...loginDetails, token: tokenForAuthentication };
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    loginValidator(email, password) {
        if (!email) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.EMAIL_REQUIRED
            ));
        }
        if (!password) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.PASSWORD_REQUIRED
            ));
        }
        return Promise.resolve(email, password);
    }


    async findByCredentials(email, password) {
        try {
            let loginDetails = await this.loginUtilityInst.findOne({ username: email });
            if (loginDetails) {
                if (!loginDetails.password) {
                    return Promise.reject(new errors.Unauthorized(RESPONSE_MESSAGE.ACCOUNT_NOT_ACTIVATED));
                }
                if (!loginDetails.is_email_verified) {
                    return Promise.reject(new errors.Unauthorized(RESPONSE_MESSAGE.EMAIL_NOT_VERIFIED));
                }
                let isPasswordMatched = await this.authUtilityInst.bcryptTokenCompare(password, loginDetails.password);
                if (!isPasswordMatched) {
                    return Promise.reject(new errors.InvalidCredentials());
                }
                return {
                    "user_id": loginDetails.user_id,
                    "email": loginDetails.username,
                    "role": loginDetails.role,
                    "member_type": loginDetails.member_type
                };
            }
            throw new errors.InvalidCredentials(RESPONSE_MESSAGE.USER_NOT_REGISTERED);
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async logout(data) {
        try {
            await this.loginUtilityInst.updateOne({ user_id: data.user_id }, { token: "" });
            await ActivityService.loginActivity(data.user_id, "logout");
            return Promise.resolve();
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    passwordValidator(email) {
        if (!email) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.EMAIL_REQUIRED
            ));
        }
        return Promise.resolve(email);
    }

    async forgotPassword(email) {
        try {
            await this.passwordValidator(email);
            let loginDetails = await this.loginUtilityInst.findOne({ username: email });
            if (loginDetails) {
                if (loginDetails.status !== ACCOUNT.ACTIVE) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.ACCOUNT_NOT_ACTIVATED));
                }
                const tokenForForgetPassword = await this.authUtilityInst.getAuthToken(loginDetails.user_id, email, loginDetails.member_type);
                let resetPasswordURL = config.app.baseURL + "reset-password?token=" + tokenForForgetPassword;

                await this.emailService.forgotPassword(email, resetPasswordURL);
                return Promise.resolve();
            }
            throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_NOT_REGISTERED);
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async changePassword(tokenData, old_password, new_password, confirm_password) {
        try {
            await this.validateChangePassword(tokenData, old_password, new_password, confirm_password);

            let loginDetails = await this.loginUtilityInst.findOne({ user_id: tokenData.user_id });
            if (loginDetails) {
                console.log("loginDetails", loginDetails);
                if (loginDetails.status !== ACCOUNT.ACTIVE) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.ACCOUNT_NOT_ACTIVATED))
                }

                let isPasswordMatched = await this.authUtilityInst.bcryptTokenCompare(old_password, loginDetails.password);
                if (!isPasswordMatched) {
                    return Promise.reject(new errors.BadRequest(RESPONSE_MESSAGE.OLD_PASSWORD_INCORRECT));
                }

                let password = await this.authUtilityInst.bcryptToken(new_password);
                await this.loginUtilityInst.updateOne({ user_id: loginDetails.user_id }, { password: password });
                return Promise.resolve();
            }
            throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_NOT_REGISTERED);

        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    validateChangePassword(tokenData, old_password, new_password, confirm_password) {
        if (!tokenData) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.TOKEN_REQUIRED
            ));
        }
        if (!old_password) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.OLD_PASSWORD_REQUIRED
            ));
        }

        if (!new_password) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.NEW_PASSWORD_REQUIRED
            ));
        }
        if (!confirm_password) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.CONFIRM_PASSWORD_REQUIRED
            ));
        }
        if (confirm_password !== new_password) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.PASSWORDS_DO_NOT_MATCH
            ));
        }

        return Promise.resolve();
    }


    async createPassword(tokenData, new_password, confirmPassword) {
        try {
            await this.validateCreatePassword(tokenData, new_password, confirmPassword);
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: tokenData.user_id })
            if (loginDetails) {
                const password = await this.authUtilityInst.bcryptToken(new_password);
                await this.loginUtilityInst.updateOne({ user_id: loginDetails.user_id }, { is_email_verified: true, status: ACCOUNT.ACTIVE, password: password });
                return Promise.resolve();
            }
            throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_NOT_REGISTERED);
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    async resetPassword(tokenData, new_password, confirmPassword) {
        try {
            await this.validateCreatePassword(tokenData, new_password, confirmPassword);

            let loginDetails = await this.loginUtilityInst.findOne({ user_id: tokenData.user_id })
            if (loginDetails) {
                if (loginDetails.status !== ACCOUNT.ACTIVE) {
                    return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.ACCOUNT_NOT_ACTIVATED));
                }
                const password = await this.authUtilityInst.bcryptToken(new_password);
                await this.loginUtilityInst.updateOne({ user_id: loginDetails.user_id }, { password: password });
                return Promise.resolve();
            }
            throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_NOT_REGISTERED);
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    validateCreatePassword(token, password, confirmPassword) {
        if (!token) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.TOKEN_REQUIRED
            ));
        }

        if (!password) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.PASSWORD_REQUIRED
            ));
        }
        if (!confirmPassword) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.CONFIRM_PASSWORD_REQUIRED
            ));
        }
        if (password !== confirmPassword) {
            return Promise.reject(new errors.ValidationFailed(
                RESPONSE_MESSAGE.PASSWORDS_DO_NOT_MATCH
            ));
        }
        return Promise.resolve();
    }

}

module.exports = AuthService;

