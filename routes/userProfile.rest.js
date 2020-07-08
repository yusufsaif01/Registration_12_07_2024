const { checkAuthToken, checkRole } = require('../middleware/auth');
const responseHandler = require('../ResponseHandler');
const UserProfileService = require('../services/UserProfileService');
const UserService = require('../services/UserService');
const userValidator = require("../middleware/validators").userValidator;
const StorageProvider = require('storage-provider');
const config = require("../config");
const STORAGE_PROVIDER_LOCAL = require('../constants/StorageProviderLocal');
const AVATAR = require('../constants/avatar')

module.exports = (router) => {
    /**
     * @api {get} /profile member profile
     * @apiName Profile
     * @apiGroup Profile
     *
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": { 
     *                  "first_name": "name",
     *                  "last_name": "last name",
     *                  "documents": [],
     *                  "position": [],
     *                  "email": "newp@newp.com",
     *                  "avatar_url": "/uploads/avatar/user-avatar.png",
     *                  "state": "mumbai",
     *                  "country": "india",
     *                  "phone": "1111111111",
     *                  "member_type": "player"
     *               }  
     *     }
     * 
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": {
     *                 "top_players": [],
     *                 "documents": [],
     *                 "email": "newclub@newclub.com",
     *                 "name": "breakers",
     *                 "avatar_url": "/uploads/avatar/user-avatar.png",
     *                 "state": "delhi",
     *                 "country": "india",
     *                 "phone": "222222222222",
     *                 "contact_person": [],
     *                 "trophies": [],
     *                 "top_signings": [],
     *                 "member_type": "club",
     *                 "profile_status": "verified"
     *                }
     *     }
     * 
     * @apiErrorExample {json} UNAUTHORIZED
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
	 *     }
     * 
     * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "message": "Internal Server Error",
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "httpCode": 500
     *     }
     *
     */
    router.get('/profile', checkAuthToken, async function (req, res) {
        try {
            let serviceInst = new UserService();
            let userServiceInst = new UserProfileService();

            responseHandler(req, res, serviceInst.getDetails(req.authUser).then((user) => {
                return userServiceInst.toAPIResponse(user);
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }

    });
    /**
     * @api {put} /update-details/:_category update profile details
     * @apiName Update profile details
     * @apiGroup Profile
     *
     * @apiParam (param) {String} _category  valid values (personal_details, professional_details, document_details)
     * @apiParam (body) {String} player_type player type can be grassroot/amateur/professional (when _category = personal_details)
     * @apiParam (body) {String} bio bio of member (when _category = personal_details)
     * @apiParam (body) {String} facebook facebook profile link of member (when _category = personal_details)
     * @apiParam (body) {String} twitter twitter profile link of member (when _category = personal_details)
     * @apiParam (body) {String} instagram instagram profile link of member (when _category = personal_details)
     * @apiParam (body) {String} youtube youtube profile link of member (when _category = personal_details)
     * @apiParam (body) {String} linked_in linked_in profile link of member (when _category = personal_details)
     * @apiParam (body) {String} aadhar_number player aadhar number (when _category = document_details)
     * @apiParam (body) {String} aadhar_media_type image or pdf (when _category = document_details) 
     * @apiParam (body) {String} aadhar_front aadhar front image file (when _category = document_details)
     * @apiParam (body) {String} aadhar_back aadhar back image file (when _category = document_details)
     * @apiParam (body) {String} aadhar aadhar pdf file (when _category = document_details)
     * @apiParam (body) {String} first_name player first name (when _category = personal_details)
     * @apiParam (body) {String} last_name player last name (when _category = personal_details)
     * @apiParam (body) {String} dob player date of birth (when _category = personal_details)
     * @apiParam (body) {String} player_height_feet player height feett (when _category = personal_details)
     * @apiParam (body) {String} player_height_inches player height inches (when _category = personal_details)
     * @apiParam (body) {String} weight player weight (when _category = personal_details)
     * @apiParam (body) {String} country country id (when _category = personal_details)
     * @apiParam (body) {String} state state id (when _category = personal_details)
     * @apiParam (body) {String} city city id (when _category = personal_details)
     * @apiParam (body) {String} school player school (when _category = personal_details)
     * @apiParam (body) {String} college player college (when _category = personal_details)
     * @apiParam (body) {String} university player university (when _category = personal_details)
     * @apiParam (body) {String} phone member phone number (when _category = personal_details)
     * @apiParam (body) {String} mobile_number club/academy mobile number (when _category = personal_details)
     * @apiParam (body) {String} position player position (array of object with id and priority) (when _category = professional_details)
     * @apiParam (body) {String} strong_foot player strong foot (when _category = professional_details)
     * @apiParam (body) {String} weak_foot player weak foot (when _category = professional_details)
     * @apiParam (body) {String} associated_club_academy (yes or no) (when _category = professional_details)
     * @apiParam (body) {String} head_coach_name head coach name (when _category = professional_details)
     * @apiParam (body) {String} head_coach_email head coach email (when _category = professional_details)
     * @apiParam (body) {String} head_coach_phone head coach phone number (when _category = professional_details)
     * @apiParam (body) {String} former_club_academy player former club/academy (when _category = professional_details)
     * @apiParam (body) {String} pincode club/academy pincode (when _category = personal_details)
     * @apiParam (body) {String} address club/academy address (when _category = personal_details)
     * @apiParam (body) {String} document_type club/academy document_type (when _category = document_details)
     * @apiParam (body) {String} type club/academy type (when _category = professional_details)
     * @apiParam (body) {String} number academy PAN/ COI/ Tin Number (when _category = document_details)
     * @apiParam (body) {String} document document file for academy (when _category = document_details)
     * @apiParam (body) {String} aiff_id club AIFF Accreditation ID (when _category = document_details)
     * @apiParam (body) {String} aiff aiff file for club (when _category = document_details)
     * @apiParam (body) {String} stadium_name club/academy stadium name (when _category = personal_details)
     * @apiParam (body) {string} trophies club/academy trophies (when _category = professional_details)
     * @apiParam (body) {string} name club/academy name (when _category = personal_details)
     * @apiParam (body) {string} league club/academy league (when _category = professional_details)
     * @apiParam (body) {string} league_other club/academy other league (when _category = professional_details)
     * @apiParam (body) {string} association club/academy/player State association  (when _category = professional_details)
     * @apiParam (body) {string} association_other club/academy/player other association (when _category = professional_details)
     * @apiParam (body) {string} short_name club/academy short name (when _category = personal_details)
     * @apiParam (body) {string} founded_in club/academy founded year (when _category = personal_details)
     * @apiParam (body) {string} top_signings club top_signings (when _category = professional_details)
     * @apiParam (body) {string} top_players academy top_players (when _category = professional_details)
     * @apiParam (body) {string} contact_person club/academy contact person (when _category = professional_details)
     *   
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": {"n": 1,
     *                "nModified": 1,
     *                "ok": 1}
     *     }
     *
     * @apiErrorExample {json} Unauthorized
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
	 *     }
     * 
     * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "message": "Internal Server Error",
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "httpCode": 500
     *     }
     *
     */
    router.put('/update-details/:_category', checkAuthToken, userValidator.profileAPIParamsValidation, userValidator.updateDetailsAPIValidation, async function (req, res) {
        try {
            let serviceInst = new UserProfileService();
            req.body._category = req.params._category
            let reqObj = await serviceInst.uploadProfileDocuments(req.body,req.authUser.user_id, req.files);

            responseHandler(req, res, serviceInst.updateProfileDetails({
                member_type: req.authUser.member_type,
                id: req.authUser.user_id,
                updateValues: reqObj
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });
/**
     * @api {put} /update-avatar update avatar
     * @apiName Update avatar
     * @apiGroup Profile
     *   
     * @apiParam (body) {String} avatar avatar will be an image file 
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     * 
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": {"n": 1,
     *                "nModified": 1,
     *                "ok": 1,
     *                "avatar_url": "\uploads\documents\Sample.jpg"
     *               }
     *     }
     *
     * @apiErrorExample {json} Unauthorized
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
	 *     }
     * 
     * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "message": "Internal Server Error",
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "httpCode": 500
     *     }
     *
     */
    router.put('/update-avatar', checkAuthToken, async function (req, res) {
        try {
            let serviceInst = new UserProfileService();
            let reqObj = req.body;

            if (req.files) {
                const configForLocal = config.storage;
                let options = STORAGE_PROVIDER_LOCAL.UPLOAD_OPTIONS;
                options.allowed_extensions = AVATAR.ALLOWED_MEDIA_EXTENSIONS;
                let storageProviderInst = new StorageProvider(configForLocal);
                if (req.files.avatar) {
                    let uploadResponse = await storageProviderInst.uploadDocument(req.files.avatar, options);
                    reqObj.avatar_url = uploadResponse.url;
                }
            }
            responseHandler(req, res, serviceInst.updateAvatar({
                member_type: req.authUser.member_type,
                id: req.authUser.user_id,
                updateValues: reqObj
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });
        /**
     * @api {delete} /avatar delete avatar
     * @apiName Delete avatar
     * @apiGroup Profile
     *
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done"
     *     }
     *
     * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "message": "Internal Server Error",
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "httpCode": 500
     *     }
     *
     * @apiErrorExample {json} UNAUTHORIZED
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "message": "Unauthorized",
     *       "code": "UNAUTHORIZED",
     *       "httpCode": 401
	 *     }
     * 
     */
    router.delete('/avatar', checkAuthToken, async function (req, res) {
        try {
            let serviceInst = new UserProfileService();
            responseHandler(req, res, serviceInst.updateProfileBio({
                member_type: req.authUser.member_type,
                id: req.authUser.user_id,
                updateValues: {
                    avatar_url: "/uploads/avatar/user-avatar.png"
                }
            }));
        } catch (e) {
            console.log(e);
            responseHandler(req, res, Promise.reject(e));
        }
    });
};



