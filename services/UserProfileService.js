const config = require('../config');
const AuthUtility = require('../db/utilities/AuthUtility');
const UserUtility = require('../db/utilities/UserUtility');
const errors = require("../errors");

/**
 *
 *
 * @class UserProfileService
 */
class UserProfileService {

    /**
     *Creates an instance of UserProfileService.
     * @memberof UserProfileService
     */
    constructor() {
        this.authUtilityInst = new AuthUtility();
        this.userUtilityInst = new UserUtility();
    }

    /**
     *
     *
     * 
     * @param {*} data
     * @returns
     * @memberof UserProfileService
     */

    updateProfile(requestedData = {}) {

        return this.updateProfileValidation(requestedData.updateValues)
            .then(() => {
                return this.userUtilityInst.updateOne({ 'id': requestedData.id }, requestedData.updateValues);
            })

    }
    updateProfileValidation(data) {
        const { founded_in } = data
        if (founded_in) {
            var d = new Date();
            var currentYear = d.getFullYear();

            if (founded_in > currentYear) {
                return Promise.reject(new errors.ValidationFailed(
                    "founded_in is greater than " + currentYear
                ));
            }
            if (founded_in < 0) {
                return Promise.reject(new errors.ValidationFailed(
                    "founded_in cannot be negative"
                ));
            }
            if (founded_in == 0) {
                return Promise.reject(new errors.ValidationFailed(
                    "founded_in cannot be zero"
                ));
            }

        }
        return Promise.resolve()
    }

    /**
     *
     *
     * @param {*} 
     * @returns
     * @memberof UserRegistrationService
     */
    toAPIResponse({ contact_person_name, contact_person_email, contact_person_phone,
        short_name,
        founded_in, address,
        stadium, owner, manager,
        pincode,
        head_coach,
        registration_number,
        avatar_url, role, top_players, top_signings,
        total_associated_players,
        associated_players, is_first_time_login, is_email_verified, is_deleted, status, username, user_id, member_type, email, country, phone, state, first_name, last_name, id, trophies, token, about, bio, city, club, college, dob, document_link, employment_contract, former_club, head_coach_email, head_coach_phone, height, player_type, position,
        school,
        strong_foot,
        university,
        weak_foot,
        weight,
        social_profiles }) {
        return {
            contact_person_name, contact_person_email, contact_person_phone,
            short_name,
            founded_in, address,
            stadium, owner, manager,
            pincode,
            head_coach,
            registration_number, avatar_url, role, top_players, top_signings,
            total_associated_players,
            associated_players, is_first_time_login, is_email_verified, is_deleted, status, username, user_id, member_type, email, country, phone, state, first_name, last_name, id, trophies, token, about, bio, city, club, college, dob, document_link, employment_contract, former_club, head_coach_email, head_coach_phone, height, player_type, position,
            school,
            strong_foot,
            university,
            weak_foot,
            weight,
            social_profiles
        };
    }


}

module.exports = UserProfileService;
