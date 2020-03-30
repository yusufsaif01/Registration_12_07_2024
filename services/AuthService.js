const Promise = require("bluebird");
const errors = require('../errors');
const config = require('../config');

const ActivityService = require('./ActivityService');

const AuthUtility = require('../db/utilities/AuthUtility');
const UserUtility = require('../db/utilities/UserUtility');
const ActivityUtility = require('../db/utilities/ActivityUtility');
const NotificationService = require('./NotificationService');

class AuthService {

    constructor() {
        this.authUtilityInst = new AuthUtility();
        this.userUtilityInst = new UserUtility();
        this.activityUtilityInst = new ActivityUtility();
    }

    login(email, password) {

        return this.loginValidator(email, password)
            .then(() => {
                let User;

                return this.findByCredentials(email, password)
                    .then((user) => {
                        User = user;
                        ActivityService.loginActivity(User.user_id, "login");
                        this.userUtilityInst.updateOne({ user_id: User.user_id }, { is_login: true });
                        return this.authUtilityInst.getAuthToken(user.id, email, user.username)
                    })
                    .then(async (Token) => {
                        await this.userUtilityInst.updateOne({ user_id: User.user_id }, { token: Token });
                        let { id, email, username ,is_email_verified} = User;
                        return { id, email, username, token: Token ,is_email_verified};
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
            let user = await this.userUtilityInst.findOne({ $or: [{ email: email }] });
            if (!user) {
                return Promise.reject(new errors.InvalidCredentials());
            }
            let checkPassword = await this.authUtilityInst.bcryptTokenCompare(password, user.password);
            if (!checkPassword) {
                return Promise.reject(new errors.InvalidCredentials());
            }
            return user;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    logout(data) {
        return this.userUtilityInst.updateOne({ user_id: data.user_id }, { is_login: false }).then((status) => {
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

    forgotPassword(email) {

        return this.passwordValidator(email)
            .then(() => {
                let User;
                let randomString

                // const roleList = ["super-admin", "admin"]; //Make It as dynamic list

                // return this.userUtilityInst.findOne({ email: email, role: { "$in": roleList } })
                return this.userUtilityInst.findOne({ email: email })
                    .then((user) => {
                        if (!user) {

                            return Promise.reject(new errors.NotFound("User not found"));
                        }
                        User = user;
                        randomString = this.authUtilityInst.randomBytes(4);
                        return this.authUtilityInst.bcryptToken(randomString);
                    })
                    .then(async (password) => {

                        await this.updateUserPassword(User, password);

                        let notifyInst = new NotificationService();
                        return notifyInst.forgotPassword(User, { randomString })
                    })
                    .then(() => {
                        return User;
                    });
            })
    }
    async resetPassword(tokenData, oldPassword, newPassword) {
        if (!tokenData) {
            return Promise.reject(new errors.ValidationFailed(
                "token is required"
            ));
        }

        if (!newPassword) {
            return Promise.reject(new errors.ValidationFailed(
                "newPassword is required"
            ));
        }
        if (!oldPassword) {
            return Promise.reject(new errors.ValidationFailed(
                "Old password is required"
            ));
        }
        
        try {
            let user = await this.userUtilityInst.findOne({ email: tokenData.email })
            if (!user) {
                return Promise.reject(new errors.NotFound("User not found."));
            }
            let checkPassword = await this.authUtilityInst.bcryptTokenCompare(oldPassword, user.password);
            if (!checkPassword) {
                return Promise.reject(new errors.BadRequest("Old assword is incorrect", { field_name: "old_password"}));
            }
            let password = await this.authUtilityInst.bcryptToken(newPassword);
            await this.updateUserPassword(tokenData, password);
            return Promise.resolve();
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    

    createPassword(tokenData, password,confirmPassword) {
        return this.validateCreatePassword(tokenData, password,confirmPassword)
            .then(() => {
                let User;

                // const roleList = ["super-admin", "admin"]; //Make It as dynamic list

                return this.userUtilityInst.findOne({ email: tokenData.email })
                    .then((user) => {
                        if (!user) {
                            return Promise.reject(new errors.NotFound("User not found"));
                        }
                        if(!user.is_email_verified){
                            return Promise.reject(new errors.ValidationFailed(
                                "email is not verified"
                            ))
                        }
                        User = user;
                        
                        return this.authUtilityInst.bcryptToken(password);
                    })
                    .then((password) => {
                        return this.updateUserPassword(tokenData, password);
                    })
                    .catch(err => { return Promise.reject(err); })
                    .then(() => {
                        return Promise.resolve();
                    });
            })

    }
    validateCreatePassword(token,password,confirmPassword) {
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
        if(password!==confirmPassword){
            return Promise.reject(new errors.ValidationFailed(
                "passwords do not match"
            ));
        }

       
        return Promise.resolve(token, password,confirmPassword)
    }

    updateUserPassword(user, password) {
        return this.userUtilityInst.updateOne({ email: user.email }, { password: password });
    }

}

module.exports = AuthService;

