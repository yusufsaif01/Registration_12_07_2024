const config = require('../config');
const AuthUtility = require('../db/utilities/AuthUtility');
const UserUtility = require('../db/utilities/UserUtility');
const PlayerUtility = require('../db/utilities/PlayerUtility')
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtiltiy');
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

    updateProfileDetails(requestedData = {}) {
        return this.updateProfileDetailsValidation(requestedData.updateValues)
            .then(() => {
                return this.setRequestData(requestedData.member_type, requestedData.updateValues)
            })
            .then((data) => {
                if(requestedData.member_type=='player')
                {
                return this.playerUtilityInst.updateOne({ 'id': requestedData.id }, data);
                }
                else
                {
                return this.clubAcademyUtilityInst.updateOne({ 'id': requestedData.id }, data);
                }

            });
    }
    setRequestData(member_type, data) {
        if (member_type == 'player') {
            let institute = {}
            if (data.school) {
                institute.school = data.school;
            }
            if (data.college) {
                institute.college = data.college;
            }
            if (data.university) {
                institute.university = data.university;
            }
            data.institute = institute;
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
    updateProfileBio(requestedData = {}) {

        return this.updateProfileBioValidation(requestedData.updateValues).
            then(() => {
                return this.setBioRequestData(requestedData.updateValues)
            })
            .then((data) => {
                return this.userUtilityInst.updateOne({ 'id': requestedData.id }, data);
            })

    }
    setBioRequestData(data) {
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
        stadium_name,
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
            stadium_name,
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
