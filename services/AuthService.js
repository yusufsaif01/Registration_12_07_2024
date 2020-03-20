const Promise = require("bluebird");
const errors = require('../errors');
const config = require('../config');

const ActivityService = require('./ActivityService');
const NotificationService = require('./NotificationService');

const AuthUtility = require('../db/utilities/AuthUtility');
const UserUtility = require('../db/utilities/UserUtility');
const ActivityUtility = require('../db/utilities/ActivityUtility');

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
                        ActivityService.loginActivity(User.emp_id, "login");
                        this.userUtilityInst.updateOne({ emp_id: User.emp_id }, { is_login: true });
                        return this.authUtilityInst.getAuthToken(user.id, user.emp_id , user.email, username)
                    })
                    .then(async (Token) => {                                     
                        await this.userUtilityInst.updateOne({ emp_id: User.emp_id }, { token : Token });
                        let { id, emp_id, email, username} = User;
                        return { id, emp_id, email, username , token : Token};
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

    findByCredentials(username, password) {
        return this.userUtilityInst.findOne({ $or: [{ username : username } , { vendor_id : username} ]})
            .then((user) => {
                if (user) {
                    if (this.authUtilityInst.tokenCompare(password, user.password)) {
                        return Promise.resolve(user);
                    } else {
                        return Promise.reject(new errors.InvalidCredentials());
                    }
                } else {
                    return Promise.reject(new errors.InvalidCredentials());
                }
            })
    }

    logout(data) {
        return  this.userUtilityInst.updateOne({ emp_id: data.emp_id }, { is_login: false }).then((status)=>{
            return Promise.resolve(status)
        }).then(()=>{
            return ActivityService.loginActivity(data.emp_id, "logout");
        }).then(()=>{
            return Promise.resolve({"Success " : true});
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
        .then(()=>{
            let User ;
            let randomString

            const roleList = ["super-admin", "admin"]; //Make It as dynamic list

            return this.userUtilityInst.findOne({ email : email  , role : { "$in": roleList } })
            .then((user) => {
                if (!user) {

                    return Promise.reject(new errors.NotFound("User not found or you are permitted."));
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

    resetPassword( tokenData , newPassword) {
        return this.validateResetPassword(tokenData, newPassword)
        .then(()=>{
            let User ;

            const roleList = ["super-admin", "admin"]; //Make It as dynamic list

            return this.userUtilityInst.findOne({ email : tokenData.email  , role : { "$in": roleList } })
            .then((user) => {
                if (!user) {
                    return Promise.reject(new errors.NotFound("User not found or you have not permitted."));
                }
                User = user;
                return this.authUtilityInst.bcryptToken(newPassword);
            })
            .then((password) => {
                return this.updateUserPassword(tokenData, password);
            })
            .catch(err=> {return Promise.reject(err);})
            .then(() => {
                return Promise.resolve();
            });
        })
        
    }
    validateResetPassword(token , newPassword) {
        if (!token) {
            return Promise.reject(new errors.ValidationFailed(
                "token is required"
            ));
        }

        if (!newPassword) {
            return Promise.reject(new errors.ValidationFailed(
                "newPassword is required"
            ));
        }
        return Promise.resolve(token, newPassword)
    }

    updateUserPassword(user , password) {
        return this.userUtilityInst.updateOne({ email: user.email }, { password : password });
    }    

}

module.exports = AuthService;

