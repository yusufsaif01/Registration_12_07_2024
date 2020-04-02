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
    toAPIResponse({ nationality,
        top_players,
    first_name,
    last_name,
    height,
    weight,
    dob,
    institiute,
    documents,
    about,
    bio,
    position,
    strong_foot,
    weak_foot,
    former_club,
    former_academy,
    specialization,
    player_type,
    email,
    name,
    avatar_url,
    state,
    country,
    city,
    phone,
    founded_in,
    address,
    stadium,
    owner,
    manager,
    short_name,
    contact_person,
    trophies,
    club_academy_details,
    top_signings,
    associated_players,
    registration_number,
    
    member_type,
    social_profiles,
    type }) {
        return {
            nationality,
            top_players,
    first_name,
    last_name,
    height,
    weight,
    dob,
    institiute,
    documents,
    about,
    bio,
    position,
    strong_foot,
    weak_foot,
    former_club,
    former_academy,
    specialization,
    player_type,
    email,
    name,
    avatar_url,
    state,
    country,
    city,
    phone,
    founded_in,
    address,
    stadium,
    owner,
    manager,
    short_name,
    contact_person,
    trophies,
    club_academy_details,
    top_signings,
    associated_players,
    registration_number,
    member_type,
    social_profiles,
    type
        };
    }


}

module.exports = UserProfileService;
