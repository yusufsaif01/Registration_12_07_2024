const Promise = require("bluebird");
const errors = require("../errors");
const UserUtility = require('../db/utilities/UserUtility');
const UserService = require("./UserService");
const uuidv4 = require('uuid/v4');
const AuthUtility = require('../db/utilities/AuthUtility');

/**
 *
 *
 * @class UserRegistrationService
 * @extends {UserService}
 */
class UserRegistrationService extends UserService {

    /**
     *Creates an instance of UserRegistrationService.
     * @memberof UserRegistrationService
     */
    constructor() {
        super();
        this.utilityInst = new UserUtility();
        this.authUtilityInst = new AuthUtility();
    }

    /**
     *
     *
     * @param {*} registerUser
     * @returns
     * @memberof UserRegistrationService
     */
    validateMemberRegistration(registerUser) {
        console.log('member_type',registerUser.member_type)
        if (registerUser.member_type == "player") {
            if (!registerUser.first_name) {
                return Promise.reject(new errors.ValidationFailed(
                    "first_name is required", { field_name: "first_name" }
                ));
            }
            if (!registerUser.last_name) {
                return Promise.reject(new errors.ValidationFailed(
                    "last_name is required", { field_name: "last_name" }
                ));
            }
        }
        else {
            if (!registerUser.name) {
                return Promise.reject(new errors.ValidationFailed(
                    "name is required", { field_name: "name" }
                ));
            }

            // if (!registerUser.registration_number) {
            //     return Promise.reject(new errors.ValidationFailed(
            //         "registration_number is required", { field_name: "registration_number" }
            //     ));
            // }
        }
       

        return Promise.resolve(registerUser);
    }

 

    /**
     *
     *
     * @param {*} userData
     * @returns
     * @memberof UserRegistrationService
     */
    memberRegistration(userData) {
     
        return this.validateMemberRegistration(userData)
            .then(() => {
                let User;
                return this.create(userData).then((user) => {
                    console.log('register',user)
                 User = user;
    
                    return this.authUtilityInst.getAuthToken(user.id, user.email)
                })
                .then(async (Token) => {
                    await this.utilityInst.updateOne({ user_id: User.user_id }, { token: Token });
                    let { id, email,is_email_verified } = User;
                    let url="http://localhost:3000/api/activate?token="+Token;
                    return { id, email, token: Token,activation_url:url, is_email_verified};
                }).then(this.toAPIResponse);
            })
    }

   



    /**
     *
     *
     * @param {*} registerUser
     * @returns
     * @memberof UserRegistrationService
     */
    validateAdminRegistration(adminData) {

        if (!adminData.email) {
            return Promise.reject(new errors.ValidationFailed(
                "email is required", { field_name: "email" }
            ));
        }

        if (!adminData.password) {
            return Promise.reject(new errors.ValidationFailed(
                "password is required", { field_name: "password" }
            ));
        }

        if (!adminData.user_id) {
            return Promise.reject(new errors.ValidationFailed(
                "user id is required", { field_name: "user_id" }
            ));
        }

        if (!adminData.dob) {
            return Promise.reject(new errors.ValidationFailed(
                "dob is required", { field_name: "dob" }
            ));
        }

        return Promise.resolve(adminData);
    }

    /**
     *
     *
     * @param {*} data
     * @returns
     * @memberof UserRegistrationService
     */
    adminRegistration(data) {

        data.user_id = data.user_id || uuidv4();
        data.dob = new Date().toLocaleDateString();
        data.doj = new Date().toLocaleDateString();

        return this.validateAdminRegistration(data)
            .then(() => {
                return this.create(data)
                    .then((user) => {
                        return user
                    }).catch(err => {
                        console.log(err);
                    });
            })
    }



    /**
     *
     *
     * @param {*}
     * 
     * @returns
     * @memberof UserRegistrationService
     */
    toAPIResponse({
        user_id,
        name,
        dob,
        role,
        email,
        avatar_url,
        state,
        country,
        phone,
        token,
        status,
        first_name,
        last_name,
        member_type,
        registration_number,
        activation_url,
        is_email_verified
    }) {
        return {
            user_id,
            name,
            dob,
            role,
            email,
            token,
            avatar_url,
            first_name,
        last_name,
        member_type,
        registration_number,
            state,
            country,
            phone,
            status,
            activation_url,
            is_email_verified
        };
    }
}

module.exports = UserRegistrationService;