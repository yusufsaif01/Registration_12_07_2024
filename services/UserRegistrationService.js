const Promise = require("bluebird");
const errors = require("../errors");
const LoginUtility = require('../db/utilities/LoginUtility');
const PlayerUtility = require('../db/utilities/PlayerUtility')
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtility');
const UserService = require("./UserService");
const uuid = require('uuid/v4');
const AuthUtility = require('../db/utilities/AuthUtility');
const EmailService = require('./EmailService');
const config = require("../config");
const _ = require("lodash");
const AdminUtility = require("../db/utilities/AdminUtility");

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
        this.playerUtilityInst = new PlayerUtility();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();
        this.loginUtilityInst = new LoginUtility();
        this.authUtilityInst = new AuthUtility();
        this.emailService = new EmailService();
        this.adminUtilityInst = new AdminUtility();
    }

    /**
     *
     *
     * @param {*} registerUser
     * @returns
     * @memberof UserRegistrationService
     */
    async validateMemberRegistration(registerUser) {
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
        } else {
            if (!registerUser.name) {
                return Promise.reject(new errors.ValidationFailed(
                    "name is required", { field_name: "name" }
                ));
            }
        }
        const user = await this.loginUtilityInst.findOne({ "username": registerUser.email });
        if (!_.isEmpty(user)) {
            return Promise.reject(new errors.Conflict(
                "Email is already registered"
            ));
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
    async memberRegistration(userData) {
        try {
            await this.validateMemberRegistration(userData);
            userData.user_id = uuid();
            userData.avatar_url = config.app.default_avatar_url; // default user icon

            let loginDetails = await this.loginUtilityInst.insert({
                user_id: userData.user_id,
                username: userData.email,
                status: 'pending',
                role: userData.member_type,
                member_type: userData.member_type
            });
            userData.login_details = loginDetails._id;

            if (userData.member_type == 'player') {
                await this.playerUtilityInst.insert(userData);
            } else {
                await this.clubAcademyUtilityInst.insert(userData);
            }
            const tokenForAccountActivation = await this.authUtilityInst.getAuthToken(userData.user_id, userData.email, userData.member_type);
            let accountActivationURL = config.app.baseURL + "create-password?token=" + tokenForAccountActivation;
            this.emailService.emailVerification(userData.email, accountActivationURL);
            return Promise.resolve();
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    /**
     *
     *
     * @param {*}
     * 
     * @returns
     * @memberof UserRegistrationService
     */
    toAPIResponse({ user_id, name, dob, role, email, avatar_url, state, country, phone, token,
        status, first_name, last_name, member_type, registration_number, is_email_verified
    }) {
        return {
            user_id, name, dob, role, email, token, avatar_url, first_name, last_name, member_type,
            registration_number, state, country, phone, status, is_email_verified
        };
    }

    async adminRegistration(adminDetails = {}) {

        const user = await this.loginUtilityInst.findOne({ "username": adminDetails.email });
        if (!_.isEmpty(user)) {
            return Promise.reject(new errors.Conflict(
                "Email is already registered"
            ));
        }

        adminDetails.user_id = uuid();
        adminDetails.avatar_url = "/uploads/avatar/user-avatar.png"; // default user icon

        let loginDetails = await this.loginUtilityInst.insert({
            user_id: adminDetails.user_id,
            username: adminDetails.email,
            status: 'active',
            role: 'admin',
            password: adminDetails.password,
            profile_status: "verified",
            is_email_verified:true
        });
        adminDetails.login_details = loginDetails._id;

        await this.adminUtilityInst.insert(adminDetails);
    }
}

module.exports = UserRegistrationService;