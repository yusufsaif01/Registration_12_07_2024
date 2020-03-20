const config = require('../config');
const AuthUtility = require('../db/utilities/AuthUtility');
const UserUtility = require('../db/utilities/UserUtility');

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
    constructor(){
        this.authUtilityInst = new AuthUtility();
        this.userUtilityInst = new UserUtility();
    }

    /**
     *
     *
     * @param {*} token
     * @param {*} data
     * @returns
     * @memberof UserProfileService
     */
    updateProfile(token, data) {

        return this.authUtilityInst.jwtVerification(token, config.jwt.jwt_secret)
        .then( (user) =>{
            return this.userUtilityInst.updateOne({ emp_id : user.emp_id }, data );
        })
    }
    
    /**
     *
     *
     * @param {*} { emp_id,emp_name,warehouse,location,department,date,doj,role,email,username,vendor_id,avatar_url,state,country,phone,status}
     * @returns
     * @memberof UserRegistrationService
     */
    toAPIResponse({ emp_id,name,warehouse,location,department,date,doj,role,email,username,vendor_id,avatar_url,state,country,phone}) {
        return { emp_id,name,warehouse,location,department,date,doj,role,email,username,vendor_id,avatar_url,state,country,phone };
    }


}

module.exports = UserProfileService;
