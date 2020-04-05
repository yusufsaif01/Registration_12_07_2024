const config = require('../config');
const AuthUtility = require('../db/utilities/AuthUtility');
const UserUtility = require('../db/utilities/UserUtility');
const PlayerUtility = require('../db/utilities/PlayerUtility')
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtility');
const errors = require("../errors");
const _ = require("lodash");

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
        this.playerUtilityInst = new PlayerUtility();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();
    }

    /**
     *
     *
     * 
     * @param {*} data
     * @returns
     * @memberof UserProfileService
     */

    async updateProfileDetails(requestedData = {}) {
        await this.updateProfileDetailsValidation(requestedData.updateValues);
        let profileData = await this.prepareProfileData(requestedData.member_type, requestedData.updateValues);

        if (requestedData.member_type == 'player') {
            return this.playerUtilityInst.updateOne({ 'user_id': requestedData.id }, profileData);
        } else {
            return this.clubAcademyUtilityInst.updateOne({ 'user_id': requestedData.id }, profileData);
        }
    }

    prepareProfileData(member_type, data) {
        if (member_type == 'player') {
            let institute = {}
            let height = {}
            if (data.school) {
                institute.school = data.school;
            }
            if (data.college) {
                institute.college = data.college;
            }
            if (data.university) {
                institute.university = data.university;
            }
            if (data.player_height_foot) {
                height.feet = data.player_height_foot
            }
            if (data.player_height_inches) {
                height.inches = data.player_height_inches
            }
            if (!_.isEmpty(institute))
                data.institute = institute;
            if (!_.isEmpty(height))
                data.height = height;
        } else {
            let manager = {}
            let owner = {}
            let address = {}
            if (data.manager) {
                manager.name = data.manager
            }
            if (data.owner) {
                owner.name = data.owner
            }
            if (data.address) {
                address.full_address = data.address
            }
            if (data.pincode) {
                address.pincode = data.pincode
            }
            if (data.country) {
                address.country = data.country
            }
            if (data.city) {
                address.city = data.city
            }
            if (!_.isEmpty(address))
                data.address = address;
            if (!_.isEmpty(manager))
                data.manager = manager;
            if (!_.isEmpty(owner))
                data.owner = owner;
        }
        return Promise.resolve(data)
    }

    async updateProfileBio(requestedData = {}) {
        let bioData = await this.prepareBioData(requestedData.updateValues);
        console.log({ 'user_id': requestedData.id }, bioData, requestedData.member_type);
        if (requestedData.member_type == 'player') {
            await this.playerUtilityInst.updateOne({ 'user_id': requestedData.id }, bioData);
        } else {
            await this.clubAcademyUtilityInst.updateOne({ 'user_id': requestedData.id }, bioData);
        }
    }

    prepareBioData(data) {
        let social_profiles = {};

        if (data.facebook)
            social_profiles.facebook = data.facebook;
        if (data.youtube)
            social_profiles.youtube = data.youtube;
        if (data.twitter)
            social_profiles.twitter = data.twitter;
        if (data.instagram)
            social_profiles.instagram = data.instagram;

        if (!_.isEmpty(social_profiles))
            data.social_profiles = social_profiles;

        return Promise.resolve(data)
    }

    updateProfileDetailsValidation(data) {
        const { founded_in, trophies } = data
        if (founded_in) {
            let msg = null;
            let d = new Date();
            let currentYear = d.getFullYear();

            if (founded_in > currentYear) {
                msg = "founded_in is greater than " + currentYear
            }
            if (founded_in < 0) {
                msg = "founded_in cannot be negative"
            }
            if (founded_in == 0) {
                msg = "founded_in cannot be zero"
            }

            if (msg) {
                return Promise.reject(new errors.ValidationFailed(msg));
            }
        }
        if (trophies) {
            let msg = null;
            let d = new Date();
            let currentYear = d.getFullYear();
            trophies.forEach(element => {
                if (element.year > currentYear) {
                    msg = "trophy year is greater than " + currentYear
                }
                if (element.year < 0) {
                    msg = "trophy year cannot be negative"
                }
                if (element.year == 0) {
                    msg = "trophy year cannot be zero"
                }
            });
            if (msg) {
                return Promise.reject(new errors.ValidationFailed(msg));
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
    toAPIResponse({
        nationality, top_players, first_name, last_name, height, weight, dob,
        institute, documents, about, bio, position, strong_foot, weak_foot, former_club,
        former_academy, specialization, player_type, email, name, avatar_url, state,
        country, city, phone, founded_in, address, stadium_name, owner, manager, short_name,
        contact_person, trophies, club_academy_details, top_signings, associated_players,
        registration_number, member_type, social_profiles, type
    }) {
        return {
            nationality, top_players, first_name, last_name, height, weight, dob,
            institute, documents, about, bio, position, strong_foot, weak_foot, former_club,
            former_academy, specialization, player_type, email, name, avatar_url, state,
            country, city, phone, founded_in, address, stadium_name, owner, manager, short_name,
            contact_person, trophies, club_academy_details, top_signings, associated_players,
            registration_number, member_type, social_profiles, type
        };
    }
}

module.exports = UserProfileService;
