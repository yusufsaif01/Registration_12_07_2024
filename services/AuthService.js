const Promise = require("bluebird");
const errors = require('../errors');
const config = require('../config');
const UserService = require('./UserService');

const ActivityService = require('./ActivityService');

const AuthUtility = require('../db/utilities/AuthUtility');
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtiltiy');
const PlayerUtility = require('../db/utilities/PlayerUtility');
const LoginUtility = require('../db/utilities/LoginUtility');
const ActivityUtility = require('../db/utilities/ActivityUtility');
const NotificationService = require('./NotificationService');

class AuthService {

    constructor() {
        this.authUtilityInst = new AuthUtility();
        this.playerUtilityInst = new PlayerUtility();
        this.loginUtilityInst = new LoginUtility();
        this.activityUtilityInst = new ActivityUtility();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();

    }

    login(email, password) {

        return this.loginValidator(email, password)
            .then(() => {
                let User, loginDetails;

                return this.findByCredentials(email, password)
                    .then((result) => {
                        User = result.user;
                        loginDetails = result.loginDetails
                        ActivityService.loginActivity(User.user_id, "login");
                        return this.authUtilityInst.getAuthToken(User.id, User.email, loginDetails.member_type)
                    })
                    .then(async (Token) => {
                        await this.loginUtilityInst.updateOne({ user_id: User.user_id }, { token: Token, status: 'active' });
                        let { id, email, username, player_type } = User;
                        let { is_email_verified, member_type, user_id } = loginDetails;
                        return { id, user_id, email, username, token: Token, is_email_verified, member_type, player_type };
                    })
            })
    }

    loginValidator(email, password) {

        if (!email) {
            return Promise.reject(new errors.ValidationFailed(
                "email is required.", { field_name: "email" }
            ));
        }
        if (!password) {
            return Promise.reject(new errors.ValidationFailed(
                "password is required.", { field_name: "password" }
            ));
        }
        return Promise.resolve(email, password);
    }


    async findByCredentials(email, password) {
        try {
            let user = await this.playerUtilityInst.findOne({ $or: [{ email: email }] });
            if (!user) {
                user = await this.clubAcademyUtilityInst.findOne({ $or: [{ email: email }] });
                if (!user)
                    return Promise.reject(new errors.NotFound("User not found"));
            }
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: user.user_id })
            if (!loginDetails.password) {
                return Promise.reject(new errors.ValidationFailed("account is not activated"))
            }
            if (!loginDetails.is_email_verified) {
                return Promise.reject((new errors.ValidationFailed(
                    "email is not verified "
                )))
            }
            let checkPassword = await this.authUtilityInst.bcryptTokenCompare(password, loginDetails.password);
            if (!checkPassword) {
                return Promise.reject(new errors.InvalidCredentials());
            }
            return { user: user, loginDetails: loginDetails };
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    logout(data) {
        return this.loginUtilityInst.updateOne({ user_id: data.user_id }, { status: 'inactive', is_first_time_login: false }).then((status) => {
            return Promise.resolve(status)
        }).then(() => {
            return ActivityService.loginActivity(data.user_id, "logout");
        }).then(() => {
            return Promise.resolve({ "Success ": true });
        })
    }

    passwordValidator(email) {

        if (!email) {
            return Promise.reject(new errors.ValidationFailed(
                "email is required.", { field_name: "email" }
            ));
        }
        return Promise.resolve(email);
    }

    async forgotPassword(email) {

        return this.passwordValidator(email)
            .then(async () => {
                let user = await this.playerUtilityInst.findOne({ $or: [{ email: email }] });
                if (!user) {
                    user = await this.clubAcademyUtilityInst.findOne({ $or: [{ email: email }] });
                    if (!user)
                        return Promise.reject(new errors.NotFound("User not found"));
                }
                let loginDetails = await this.loginUtilityInst.findOne({ user_id: user.user_id })
                if (!loginDetails.password) {
                    return Promise.reject(new errors.ValidationFailed("account is not activated"))
                }
                if (!loginDetails.is_email_verified) {
                    return Promise.reject((new errors.ValidationFailed(
                        "email is not verified "
                    )))
                }
                return this.authUtilityInst.getAuthToken(user.id, user.email,loginDetails.member_type)
                    .then(async (Token) => {
                        let url = config.app.baseURL + "reset-password?token=" + Token;
                        let notifyInst = new NotificationService();
                        await notifyInst.forgotPassword(user, url)
                        return Promise.resolve();
                    })
            })
    }
    async changePassword(tokenData, old_password, new_password, confirm_password) {
        if (!tokenData) {
            return Promise.reject(new errors.ValidationFailed(
                "token is required"
            ));
        }
        if (!old_password) {
            return Promise.reject(new errors.ValidationFailed(
                "Old password is required"
            ));
        }

        if (!new_password) {
            return Promise.reject(new errors.ValidationFailed(
                "New password is required"
            ));
        }
        if (!confirm_password) {
            return Promise.reject(new errors.ValidationFailed(
                "Confirm password is required"
            ));
        }
        if (confirm_password !== new_password) {
            return Promise.reject(new errors.ValidationFailed(
                "Passwords do not match"
            ));
        }


        try {
            let user;
            if (tokenData.member_type == 'player') {
                user = await this.playerUtilityInst.findOne({ email: tokenData.email });
            }
            else {
                user = await this.clubAcademyUtilityInst.findOne({ email: tokenData.email })
            }

            if (!user) {
                return Promise.reject(new errors.Conflict("User not found"));
            }
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: tokenData.user_id })
            if (!loginDetails.password) {
                return Promise.reject(new errors.ValidationFailed("account is not activated"))
            }
            if (!loginDetails.is_email_verified) {
                return Promise.reject(new errors.Conflict("email is not verified"));
            }
            let checkPassword = await this.authUtilityInst.bcryptTokenCompare(old_password, loginDetails.password);
            if (!checkPassword) {
                return Promise.reject(new errors.BadRequest("Old password is incorrect", { field_name: "old_password" }));
            }

            let password = await this.authUtilityInst.bcryptToken(new_password);
            await this.updateUserPassword(tokenData, password);
            return Promise.resolve();
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }


    async createPassword(tokenData, password, confirmPassword) {
        return this.validateCreatePassword(tokenData, password, confirmPassword)
            .then(async () => {
                let user;

                console.log('token', tokenData)
                if (tokenData.member_type == 'player') {
                    user = await this.playerUtilityInst.findOne({ email: tokenData.email });
                }
                else {
                    user = await this.clubAcademyUtilityInst.findOne({ email: tokenData.email })
                }

                if (!user) {
                    return Promise.reject(new errors.Conflict("User not found"));
                }
                let loginDetails = await this.loginUtilityInst.findOne({ user_id: tokenData.user_id })
                console.log('login details', loginDetails);
                if (loginDetails.is_email_verified) {
                    return Promise.reject(new errors.Conflict("Password already created"));
                }
                await this.loginUtilityInst.updateOne({ user_id: loginDetails.user_id }, { is_email_verified: true })

                return this.authUtilityInst.bcryptToken(password)

                    .then((password) => {
                        return this.updateUserPassword(tokenData, password);
                    })
                    .catch(err => { return Promise.reject(err); })
                    .then(() => {
                        return Promise.resolve();
                    });
            })

    }
    async resetPassword(tokenData, password, confirmPassword) {
        return this.validateCreatePassword(tokenData, password, confirmPassword)
            .then(async () => {
                let user;
                if (tokenData.member_type == 'player') {
                    user = await this.playerUtilityInst.findOne({ email: tokenData.email });
                }
                else {
                    user = await this.clubAcademyUtilityInst.findOne({ email: tokenData.email })
                }

                if (!user) {
                    return Promise.reject(new errors.Conflict("User not found"));
                }
                let loginDetails = await this.loginUtilityInst.findOne({ user_id: tokenData.user_id })

                if (!loginDetails.is_email_verified) {
                    return Promise.reject(new errors.ValidationFailed(
                        "email is not verified"
                    ))
                }
                return this.authUtilityInst.bcryptToken(password)
                    .then((password) => {
                        return this.updateUserPassword(tokenData, password);
                    })
                    .catch(err => { return Promise.reject(err); })
                    .then(() => {
                        return Promise.resolve();
                    });
            })
    }
    validateCreatePassword(token, password, confirmPassword) {
        if (!token) {
            return Promise.reject(new errors.ValidationFailed(
                "token is required"
            ));
        }

        if (!password) {
            return Promise.reject(new errors.ValidationFailed(
                "password is required"
            ));
        }
        if (!confirmPassword) {
            return Promise.reject(new errors.ValidationFailed(
                "confirmPassword is required"
            ));
        }
        if (password !== confirmPassword) {
            return Promise.reject(new errors.ValidationFailed(
                "passwords do not match"
            ));
        }


        return Promise.resolve(token, password, confirmPassword)
    }

    updateUserPassword(user, password) {
        return this.loginUtilityInst.updateOne({ user_id: user.user_id }, { password: password });
    }

}

module.exports = AuthService;

