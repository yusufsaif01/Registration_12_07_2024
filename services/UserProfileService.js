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
        .then(()=>{
            return this.setRequestData(requestedData.member_type,requestedData.updateValues)
        })
            .then((data) => {
                return this.userUtilityInst.updateOne({ 'id': requestedData.id }, data);
            })

    }
    setRequestData(member_type,data){
    
        if(member_type=='player')
        {
            let institute={}
                institute.school=data.school;
                institute.college=data.college;
                institute.university=data.university;
                data.institute=institute;
        }
        else{
            let manager={}
            let owner={}
            let address={}
                manager.name=data.manager
                owner.name=data.owner
                address.full_address=data.address
                address.pincode=data.pincode
                data.address=address;
                data.manager=manager;
                data.owner=owner;
        }
        return Promise.resolve(data)
    }
    updateProfileBio(requestedData = {}) {

        return this.updateProfileBioValidation(requestedData.updateValues).
        then(()=>{
            return this.setBioRequestData(requestedData.updateValues)
        })
            .then((data) => {
                return this.userUtilityInst.updateOne({ 'id': requestedData.id }, data);
            })

    }
    setBioRequestData(data)
    {
        let social_profiles={};
        social_profiles.facebook=data.facebook;
        social_profiles.youtube=data.youtube;
        social_profiles.twitter=data.twitter;
        social_profiles.instagram=data.instagram;
        data.social_profiles=social_profiles;
        console.log(data)
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
