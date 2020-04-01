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

    updateProfileDetails(requestedData = {}) {

        return this.updateProfileDetailsValidation(requestedData.updateValues)
            .then(() => {
                return this.userUtilityInst.updateOne({ 'id': requestedData.id }, requestedData.updateValues);
            })

    }
    updateProfileBio(requestedData = {}) {

        return this.updateProfileBioValidation(requestedData.updateValues)
            .then(() => {
                return this.userUtilityInst.updateOne({ 'id': requestedData.id }, requestedData.updateValues);
            })

    }
    updateProfileBioValidation(data) {
        return Promise.resolve()
    }

    updateProfileDetailsValidation(data) {
        const { founded_in, trophies } = data
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
        if (trophies) {
            var d = new Date();
            var msg;
            var currentYear = d.getFullYear();
            trophies.forEach(element => {


                if (element.year > currentYear) {

                    msg = "trophie year is greater than " + currentYear

                }
                if (element.year < 0) {

                    msg = "trophie year cannot be negative"

                }
                if (element.year == 0) {

                    msg = "trophie cannot be zero"

                }
            });
            if (msg) {
                return Promise.reject(new errors.ValidationFailed(
                    msg
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
    toAPIResponse({ contact_person,
        short_name,
        founded_in, address,
        stadium, owner, manager,
        club_academy_details,
        registration_number,
        avatar_url, role, top_players, top_signings,
        associated_players, is_first_time_login, is_email_verified, is_deleted, status, username, user_id, member_type, email, country, phone, state, first_name, last_name, id, trophies, token, about, bio, city, club, dob, document_links, former_club, height, player_type, position,
        strong_foot,
        institution,
        league,
        weak_foot,
        weight,
        social_profiles }) {
        return {
            contact_person,
            short_name,
            founded_in, address,
            stadium, owner, manager,
            address,
            club_academy_details,
            registration_number, avatar_url, role, top_players, top_signings,
            associated_players, is_first_time_login, is_email_verified, is_deleted, status, username, user_id, member_type, email, country, phone, state, first_name, last_name, id, trophies, token, about, bio, city, club, dob, document_links, former_club, height, player_type, position,
            
            strong_foot,
            league,
            institution,
            weak_foot,
            weight,
            social_profiles
        };
    }


}

module.exports = UserProfileService;
