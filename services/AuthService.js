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

    login(username, password) {

        return this.loginValidator(username, password)
            .then(() => {
                let User;

                return this.findByCredentials(username, password)
                    .then((user) => {
                        User = user;
                        ActivityService.loginActivity(User.user_id, "login");
                        this.userUtilityInst.updateOne({ user_id: User.user_id }, { is_login: true });
                        return this.authUtilityInst.getAuthToken(user.id, user.email, username)
                    })
                    .then(async (Token) => {
                        await this.userUtilityInst.updateOne({ user_id: User.user_id }, { token: Token });
                        let { id, emp_id, email, username } = User;
                        return { id, emp_id, email, username, token: Token };
                    })
            })
    }

    loginValidator(username, password) {

        if (!username) {
            return Promise.reject(new errors.ValidationFailed(
                "username is required.", { field_name: "username" }
            ));
        }
        if (!password) {
            return Promise.reject(new errors.ValidationFailed(
                "password is required.", { field_name: "password" }
            ));
        }
        return Promise.resolve(username, password);
    }


    async findByCredentials(username, password) {
        try {
            let user = await this.userUtilityInst.findOne({ $or: [{ username: username }] });
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

    // resetPassword(tokenData,oldPassword, newPassword) {
    //     return this.validateResetPassword(tokenData,oldPassword, newPassword)
    //         .then(() => {
    //             let User;

    //             // const roleList = ["super-admin", "admin"]; //Make It as dynamic list

    //             return this.userUtilityInst.findOne({ email: tokenData.email })
    //                 .then((user) => {
    //                     if (!user) {
    //                         return Promise.reject(new errors.NotFound("User not found"));
    //                     }
    //                     User = user;
                        
    //                     return this.authUtilityInst.bcryptToken(newPassword);
    //                 })
    //                 .then((password) => {
    //                     return this.updateUserPassword(tokenData, password);
    //                 })
    //                 .catch(err => { return Promise.reject(err); })
    //                 .then(() => {
    //                     return Promise.resolve();
    //                 });
    //         })

    // }
    // validateResetPassword(token,oldPassword,newPassword) {
    //     if (!token) {
    //         return Promise.reject(new errors.ValidationFailed(
    //             "token is required"
    //         ));
    //     }

    //     if (!newPassword) {
    //         return Promise.reject(new errors.ValidationFailed(
    //             "newPassword is required"
    //         ));
    //     }
    //     if (!oldPassword) {
    //         return Promise.reject(new errors.ValidationFailed(
    //             "Old password is required"
    //         ));
    //     }
    //     return Promise.resolve(token,oldPassword, newPassword)
    // }

    updateUserPassword(user, password) {
        return this.userUtilityInst.updateOne({ email: user.email }, { password: password });
    }

}

module.exports = AuthService;

