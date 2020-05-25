const config = require('../config');
const AuthUtility = require('../db/utilities/AuthUtility');
const UserUtility = require('../db/utilities/UserUtility');
const PlayerUtility = require('../db/utilities/PlayerUtility')
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtility');
const FileService = require('../services/FileService');
const errors = require("../errors");
const _ = require("lodash");
const MEMBER = require('../constants/MemberType');
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const moment = require('moment');
const CountryUtility = require('../db/utilities/CountryUtility');
const StateUtility = require('../db/utilities/StateUtility');
const CityUtility = require('../db/utilities/CityUtility');
const PositionUtility = require('../db/utilities/PositionUtility');

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
        this.countryUtilityInst = new CountryUtility();
        this.stateUtilityInst = new StateUtility();
        this.cityUtilityInst = new CityUtility();
        this.positionUtilityInst = new PositionUtility();
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
        await this.updateProfileDetailsValidation(requestedData.updateValues, requestedData.member_type, requestedData.id);
        let profileData = await this.prepareProfileData(requestedData.member_type, requestedData.updateValues);
        if (requestedData.member_type == MEMBER.PLAYER) {
            let playerData = await this.prepareDocumentObj(profileData, requestedData.id);
            await this.playerUtilityInst.updateOne({ 'user_id': requestedData.id }, playerData);
        } else {
            await this.clubAcademyUtilityInst.updateOne({ 'user_id': requestedData.id }, profileData);
        }
    }
    async prepareDocumentObj(reqObj = {}, user_id) {
        if (!reqObj.documents)
            return Promise.resolve(reqObj)
        let details = await this.playerUtilityInst.findOne({ user_id: user_id }, { documents: 1 });
        if (details && details.documents && details.documents.length) {
            let documents = details.documents;
            let aadharDB = _.find(documents, { type: "aadhar" });
            let playerContractDB = _.find(documents, { type: "employment_contract" });
            let aadharReqObj = _.find(reqObj.documents, { type: "aadhar" })
            let playerContractReqObj = _.find(reqObj.documents, { type: "employment_contract" })
            if (aadharReqObj && !playerContractReqObj && playerContractDB) {
                reqObj.documents.push(playerContractDB)
            }
            if (playerContractReqObj && !aadharReqObj && aadharDB) {
                reqObj.documents.push(aadharDB)
            }
        }
        return Promise.resolve(reqObj)
    }

    prepareProfileData(member_type, data) {
        if (data.dob) {
            data.dob = moment(data.dob).format("YYYY-MM-DD");
        }
        if (member_type == MEMBER.PLAYER) {
            let institute = {
                "school": data.school ? data.school : null,
                "college": data.college ? data.college : null,
                "university": data.university ? data.university : null
            };
            let height = {
                "feet": data.height_feet ? data.height_feet : null,
                "inches": data.height_inches ? data.height_inches : null
            };

            let club_academy_details = {
                "head_coach_name": data.head_coach_name ? data.head_coach_name : "",
                "head_coach_phone": data.head_coach_phone ? data.head_coach_phone : "",
                "head_coach_email": data.head_coach_email ? data.head_coach_email : ""
            };

            if (!_.isEmpty(institute))
                data.institute = institute;

            if (!_.isEmpty(height))
                data.height = height;
            if (!_.isEmpty(club_academy_details))
                data.club_academy_details = club_academy_details;

        } else {
            let manager = {};
            let owner = {};
            let address = {};

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

            if (!_.isEmpty(address))
                data.address = address;

            if (!_.isEmpty(manager))
                data.manager = manager;

            if (!_.isEmpty(owner))
                data.owner = owner;

            if (data.documents) {
                if (member_type === MEMBER.ACADEMY && data.document_type && data.number) {
                    let documentReqObj = _.find(data.documents, { type: data.document_type })
                    if (documentReqObj) {
                        documentReqObj.document_number = data.number
                        data.documents = [documentReqObj]
                    }
                }
                if (member_type === MEMBER.CLUB && data.reg_number) {
                    let documentReqObj = _.find(data.documents, { type: "aiff" })
                    if (documentReqObj) {
                        documentReqObj.document_number = data.reg_number
                        data.documents = [documentReqObj]
                    }
                }
            }
        }
        return Promise.resolve(data)
    }

    async updateProfileBio(requestedData = {}) {
        let bioData = await this.prepareBioData(requestedData.updateValues);
        console.log({ 'user_id': requestedData.id }, bioData, requestedData.member_type);
        if (requestedData.member_type == MEMBER.PLAYER) {
            let res = await this.playerUtilityInst.updateOne({ 'user_id': requestedData.id }, bioData);
            if (bioData.avatar_url) {
                const { avatar_url } = await this.playerUtilityInst.findOne({ user_id: requestedData.id }, { avatar_url: 1 })
                res.avatar_url = avatar_url;
            }
            return res;
        } else {
            let res = await this.clubAcademyUtilityInst.updateOne({ 'user_id': requestedData.id }, bioData);
            if (bioData.avatar_url) {
                const { avatar_url } = await this.clubAcademyUtilityInst.findOne({ user_id: requestedData.id }, { avatar_url: 1 })
                res.avatar_url = avatar_url;
            }
            return res;
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

    async updateProfileDetailsValidation(data, member_type, user_id) {
        const { founded_in, trophies, documents, country, state, city, position } = data
        if (founded_in) {
            let msg = null;
            let d = new Date();
            let currentYear = d.getFullYear();

            if (founded_in > currentYear) {
                msg = RESPONSE_MESSAGE.FOUNDED_IN_GREATER_THAN_CURRENT_YEAR
            }
            if (founded_in < 0) {
                msg = RESPONSE_MESSAGE.FOUNDED_IN_CANNOT_BE_NEGATIVE
            }
            if (founded_in == 0) {
                msg = RESPONSE_MESSAGE.FOUNDED_IN_CANNOT_BE_ZERO
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
                    msg = RESPONSE_MESSAGE.TROPHY_YEAR_GREATER_THAN_CURRENT_YEAR
                }
                if (element.year < 0) {
                    msg = RESPONSE_MESSAGE.TROPHY_YEAR_CANNOT_BE_NEGATIVE
                }
                if (element.year == 0) {
                    msg = RESPONSE_MESSAGE.TROPHY_YEAR_CANNOT_BE_ZERO
                }
            });
            if (msg) {
                return Promise.reject(new errors.ValidationFailed(msg));
            }
        }
        if (documents && member_type) {
            if (member_type === MEMBER.ACADEMY && !data.number) {
                return Promise.reject(new errors.ValidationFailed("PAN/ COI/ Tin Number is required"));
            }
            if (member_type === MEMBER.CLUB && !data.reg_number) {
                return Promise.reject(new errors.ValidationFailed("AIFF Registration Number is required"));
            }
            if (member_type !== MEMBER.PLAYER && (data.number || data.reg_number)) {
                let documentNum = data.number ? data.number : data.reg_number
                const details = await this.clubAcademyUtilityInst.findOne(
                    {
                        member_type: member_type, documents: {
                            $elemMatch: {
                                document_number: documentNum
                            }
                        }
                    }, { documents: 1, user_id: 1 });
                if (!_.isEmpty(details)) {
                    if (details.user_id !== user_id)
                        return Promise.reject(new errors.Conflict("document number already in use"));
                }
            }
        }

        if (country && state && city) {
            if (!country.id) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.COUNTRY_ID_REQUIRED));
            }
            if (!state.id) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.STATE_ID_REQUIRED));
            }
            if (!city.id) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CITY_ID_REQUIRED));
            }
            if (!country.name) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.COUNTRY_NAME_REQUIRED));
            }
            if (!state.name) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.STATE_NAME_REQUIRED));
            }
            if (!city.name) {
                return Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.CITY_NAME_REQUIRED));
            }

            let foundCountry = await this.countryUtilityInst.findOne({ id: country.id, name: country.name });
            if (_.isEmpty(foundCountry)) {
                return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.COUNTRY_NOT_FOUND));
            }
            let foundState = await this.stateUtilityInst.findOne({
                id: state.id,
                country_id: country.id,
                name: state.name
            })
            if (_.isEmpty(foundState)) {
                return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.STATE_NOT_FOUND));
            }
            let foundCity = await this.cityUtilityInst.findOne({
                id: city.id,
                state_id: state.id,
                name: city.name
            })
            if (_.isEmpty(foundCity)) {
                return Promise.reject(new errors.NotFound(RESPONSE_MESSAGE.CITY_NOT_FOUND));
            }
        }

        if (position) {
            let msg = null;
            position.forEach(async function (element) {
                if (!element.id) {
                    msg = RESPONSE_MESSAGE.POSITION_ID_REQUIRED
                }
                if (!element.name) {
                    msg = RESPONSE_MESSAGE.POSITION_NAME_REQUIRED
                }
                if (element.id && element.name) {
                    const foundPosition = await this.positionUtilityInst.findOne({ id: element.id, name: element.name });
                    if (_.isEmpty(foundPosition)) {
                        msg = RESPONSE_MESSAGE.POSITION_NOT_FOUND
                    }
                }
                if (!element.priority) {
                    msg = RESPONSE_MESSAGE.POSITION_PRIORITY_REQUIRED
                }
            });
            if (msg) {
                return Promise.reject(new errors.ValidationFailed(msg));
            }
        }
        return Promise.resolve()
    }

    async uploadProfileDocuments(reqObj = {}, files = null) {
        try {
            if (files) {
                reqObj.documents = [];
                const _fileInst = new FileService();
                if (files.aadhar) {
                    let file_url = await _fileInst.uploadFile(files.aadhar, "./documents/", files.aadhar.name);
                    reqObj.documents.push({ link: file_url, type: 'aadhar' });
                }
                if (files.aiff) {
                    let file_url = await _fileInst.uploadFile(files.aiff, "./documents/", files.aiff.name);
                    reqObj.documents.push({ link: file_url, type: 'aiff' });
                }
                if (files.employment_contract) {
                    let file_url = await _fileInst.uploadFile(files.employment_contract, "./documents/", files.employment_contract.name);
                    reqObj.documents.push({ link: file_url, type: 'employment_contract' });
                }
                if (reqObj.document_type && files.document) {
                    let file_url = await _fileInst.uploadFile(files.document, "./documents/", files.document.name);
                    reqObj.documents.push({ link: file_url, type: reqObj.document_type });
                }
            }

            if (reqObj.contact_person) {
                try {
                    reqObj.contact_person = JSON.parse(reqObj.contact_person);
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_CONTACT_PERSONS);
                }
            }
            if (reqObj.trophies) {
                try {
                    let trophies = JSON.parse(reqObj.trophies);
                    reqObj.trophies = trophies;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_TROPHIES);
                }
            }

            if (reqObj.position) {
                try {
                    let position = JSON.parse(reqObj.position);
                    reqObj.position = position;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_POSITION);
                }
            }

            if (reqObj.top_players) {
                try {
                    let top_players = JSON.parse(reqObj.top_players);
                    reqObj.top_players = top_players;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_TOP_PLAYERS);
                }
            }

            if (reqObj.owner) {
                try {
                    let owner = JSON.parse(reqObj.owner);
                    reqObj.owner = owner;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_OWNER);
                }
            }

            if (reqObj.manager) {
                try {
                    let manager = JSON.parse(reqObj.manager);
                    reqObj.manager = manager;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_MANAGER);
                }
            }

            if (reqObj.top_signings) {
                try {
                    let top_signings = JSON.parse(reqObj.top_signings);
                    reqObj.top_signings = top_signings;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_TOP_SIGNINGS);
                }
            }

            if (reqObj.country) {
                try {
                    let country = JSON.parse(reqObj.country);
                    reqObj.country = country;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_COUNTRY);
                }
            }

            if (reqObj.state) {
                try {
                    let state = JSON.parse(reqObj.state);
                    reqObj.state = state;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_STATE);
                }
            }

            if (reqObj.city) {
                try {
                    let city = JSON.parse(reqObj.city);
                    reqObj.city = city;
                } catch (e) {
                    console.log(e);
                    throw new errors.ValidationFailed(RESPONSE_MESSAGE.INVALID_VALUE_CITY);
                }
            }

            return reqObj;
        } catch (e) {
            throw e;
        }
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
        contact_person, trophies, club_academy_details, top_signings, associated_players, registration_number,
        member_type, social_profiles, type, league, league_other, association, association_other
    }) {
        return {
            nationality, top_players, first_name, last_name, height, weight, dob,
            institute, documents, about, bio, position, strong_foot, weak_foot, former_club,
            former_academy, specialization, player_type, email, name, avatar_url, state,
            country, city, phone, founded_in, address, stadium_name, owner, manager, short_name,
            contact_person, trophies, club_academy_details, top_signings, associated_players, registration_number,
            member_type, social_profiles, type, league, league_other, association, association_other
        };
    }
}

module.exports = UserProfileService;
