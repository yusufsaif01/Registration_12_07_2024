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
    // async update(requestedData = {}) {
    //     try {
    //         return this.utilityInst.findOneAndUpdate({ "id": requestedData.id }, requestedData.updateValues);
    //     } catch (e) {
    //         console.log("Error in update() of UserUtility", e);
    //         return Promise.reject(e);
    //     }
    // }
    updateProfile(requestedData = {}) {
        return this.userUtilityInst.updateOne({ 'id': requestedData.id }, requestedData.updateValues);
        // return this.validatePlayerProfileUpdate(requestedData.updateValues)
        // .then((data) => {
                
        // })
        // return this.authUtilityInst.jwtVerification(token, config.jwt.jwt_secret)
        //     .then((user) => {
        //         return this.userUtilityInst.updateOne({ emp_id: user.emp_id }, data);
        //     })
    }
    // validatePlayerProfileUpdate(playerData) {
    //     if (playerData.player_type == 'amateur' || playerData.player_type == 'professional') {

    //         if (!playerData.university) {
    //             return Promise.reject(new errors.ValidationFailed(
    //                 "university is required", { field_name: "university" }
    //             ));
    //         }
    //         if (!playerData.college) {
    //             return Promise.reject(new errors.ValidationFailed(
    //                 "college is required", { field_name: "college" }
    //             ));
    //         }
    //         if (playerData.player_type == 'professional' && !playerData.employment_contract) {
    //             return Promise.reject(new errors.ValidationFailed(
    //                 "employment_contract is required", { field_name: "employment_contract" }
    //             ));
    //         }
    //         if (playerData.club == 'yes') {
    //             if (!playerData.head_coach_phone) {
    //                 return Promise.reject(new errors.ValidationFailed(
    //                     "head_coach_phone is required", { field_name: "head_coach_phone" }
    //                 ));
    //             }
    //             if (!playerData.head_coach_email) {
    //                 return Promise.reject(new errors.ValidationFailed(
    //                     "head_coach_email is required", { field_name: "head_coach_email" }
    //                 ));
    //             }
    //             if (playerData.player_type == 'professional' && !playerData.former_club) {
    //                 return Promise.reject(new errors.ValidationFailed(
    //                     "former_club is required", { field_name: "former_club" }
    //                 ));
    //             }
    //         }

    //     }
    //     if (playerData.player_type == 'grassroot') {
    //         if (!playerData.school) {
    //             return Promise.reject(new errors.ValidationFailed(
    //                 "school is required", { field_name: "school" }
    //             ));
    //         }
    //         if (playerData.club == 'yes') {
    //             if (!playerData.head_coach_phone) {
    //                 return Promise.reject(new errors.ValidationFailed(
    //                     "head_coach_phone is required", { field_name: "head_coach_phone" }
    //                 ));
    //             }
    //             if (!playerData.head_coach_email) {
    //                 return Promise.reject(new errors.ValidationFailed(
    //                     "head_coach_email is required", { field_name: "head_coach_email" }
    //                 ));
    //             }
    //         }
    //     }

    //     return Promise.resolve(playerData);
    // }
    /**
     *
     *
     * @param {*} 
     * @returns
     * @memberof UserRegistrationService
     */
    toAPIResponse({contact_person_name,contact_person_email,contact_person_phone,
        short_name,
        founded_in,address,
        stadium,owner,manager,
        pincode,
        head_coach,
        registration_number,
        avatar_url,role,top_players,top_signings,
        total_associated_players,
        associated_players,is_first_time_login,is_email_verified,is_deleted,status,username,user_id,member_type,email,country,phone,state,first_name,last_name,id,trophies,token,about,bio,city,club,college,dob,document_link,employment_contract,former_club,head_coach_email,head_coach_phone,height,player_type,position,
    school,
    strong_foot,
    university,
    weak_foot,
    weight,
    social_profiles }) {
        return {contact_person_name,contact_person_email,contact_person_phone,
            short_name,
            founded_in,address,
            stadium,owner,manager,
            pincode,
            head_coach,
            registration_number,avatar_url,role,top_players,top_signings,
            total_associated_players,
            associated_players,is_first_time_login,is_email_verified,is_deleted,status,username,user_id,member_type,email,country,phone,state,first_name,last_name,id,trophies,token,about,bio,city,club,college,dob,document_link,employment_contract,former_club,head_coach_email,head_coach_phone,height,player_type,position,
            school,
            strong_foot,
            university,
            weak_foot,
            weight,
            social_profiles };
    }


}

module.exports = UserProfileService;
