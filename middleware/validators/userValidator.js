const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const MEMBER = require('../../constants/MemberType');
const TYPE = require('../../constants/ClubAcademyType');
const PLAYER = require('../../constants/PlayerType');
const STRONG_FOOT = require('../../constants/StrongFoot');
const SORT_ORDER = require('../../constants/SortOrder');
const PROFILE = require('../../constants/ProfileStatus');
const EMAIL_VERIFIED = require('../../constants/EmailVerified');
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');
const DOCUMENT_TYPE = require('../../constants/DocumentType');
const AADHAR_MEDIA_TYPE = require('../../constants/AadharMediaType');
class UserValidator {

    async createAPIValidation(req, res, next) {
        let registerRule = {
            "phone": Joi.string().regex(/^[0-9]{10}$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.PHONE_NUMBER_INVALID,
                };
            }),
            "member_type": Joi.string().valid(MEMBER.PLAYER, MEMBER.CLUB, MEMBER.ACADEMY).required(),
            "type": Joi.string().allow(""),
            "name": Joi.string().min(1).regex(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            }),
            "first_name": Joi.string().min(1).regex(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.FIRST_NAME_INVALID,
                };
            }),
            "last_name": Joi.string().min(1).regex(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.LAST_NAME_INVALID,
                };
            }),
            "email": Joi.string().email({ minDomainSegments: 2 }).required()
        };

        if (req.body.type && req.body.member_type) {
            if (req.body.member_type === MEMBER.PLAYER) {
                registerRule.type = Joi.string().valid(PLAYER.GRASSROOT, PLAYER.AMATEUR, PLAYER.PROFESSIONAL).required()
            }
            else {
                registerRule.type = Joi.string().valid(TYPE.RESIDENTIAL, TYPE.NON_RESIDENTIAL).required()
            }
        }
        const schema = Joi.object().keys(registerRule);

        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async updateDetailsAPIValidation(req, res, next) {
        let academyRule = {
            "name": Joi.string().trim().min(1).required().regex(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.NAME_INVALID,
                };
            }),
            "founded_in": Joi.number().min(1).required(),
            "country": Joi.string().required(),
            "state": Joi.string().required(),
            "city": Joi.string().required(),
            "phone": Joi.string().regex(/^[0-9]{10}$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.PHONE_NUMBER_INVALID,
                };
            }),

            "short_name": Joi.string().trim().allow(""),
            "pincode": Joi.string().trim().allow(""),
            "address": Joi.string().trim().allow(""),
            "stadium_name": Joi.string().trim().allow(""),
            "document_type": Joi.string().trim().allow(""),
            "type": Joi.string().trim().valid(TYPE.RESIDENTIAL, TYPE.NON_RESIDENTIAL).required(),
            "number": Joi.string().trim(),
            "reg_number": Joi.string().trim(),
            "associated_players": Joi.number().allow(""),
            "head_coach_name": Joi.string().trim().allow(""),
            "head_coach_email": Joi.string().trim().email({ minDomainSegments: 2 }).allow(""),
            "head_coach_phone": Joi.string().trim().allow(""),

            "league": Joi.string().trim().min(1),
            "league_other": Joi.string().trim().min(1),
            "association": Joi.string().trim().min(1),
            "association_other": Joi.string().trim().min(1),

            "owner": Joi.string(),
            "manager": Joi.string(),
            "top_signings": Joi.string(),
            "contact_person": Joi.string(),
            "trophies": Joi.string(),
            "top_players": Joi.string(),

            // need to remove
            "document": Joi.any(),
            "aiff": Joi.any()

        };
        if (req.body.member_type) {
            let member_type = req.body.member_type
            if (member_type === MEMBER.CLUB)
                academyRule.document_type = Joi.string().valid(DOCUMENT_TYPE.AIFF);

            if (member_type === MEMBER.ACADEMY)
                academyRule.document_type = Joi.string().valid(DOCUMENT_TYPE.AIFF, DOCUMENT_TYPE.PAN, DOCUMENT_TYPE.TIN, DOCUMENT_TYPE.COI);
        }
        if (req.body.document_type) {
            let document_type = req.body.document_type;
            if (document_type === 'pan') {
                academyRule.number = Joi.string().min(10).max(10).regex(/^[A-Z]{5}[0-9]{4}[A-Z]/).error(() => {
                    return {
                        message: RESPONSE_MESSAGE.PAN_NUMBER_INVALID,
                    };
                })
            }
            if (document_type === 'coi') {
                academyRule.number = Joi.string().regex(/^[a-z-A-Z0-9]+$/).error(() => {
                    return {
                        message: RESPONSE_MESSAGE.COI_NUMBER_INVALID,
                    };
                })
            }
            if (document_type === 'tin') {
                academyRule.number = Joi.string().min(9).max(12).regex(/^\d+$/).error(() => {
                    return {
                        message: RESPONSE_MESSAGE.TIN_NUMBER_INVALID,
                    };
                })
            }
        }

        let playerRule = {
            "player_type": Joi.string().trim().min(1).valid(PLAYER.GRASSROOT, PLAYER.AMATEUR, PLAYER.PROFESSIONAL).required(),
            "first_name": Joi.string().trim().min(1).max(500).required().regex(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.FIRST_NAME_INVALID,
                };
            }),
            "last_name": Joi.string().trim().min(1).max(500).required().regex(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.LAST_NAME_INVALID,
                };
            }),
            "dob": Joi.string().trim().required(),
            "country": Joi.string().required(),
            "state": Joi.string().required(),
            "phone": Joi.string().regex(/^[0-9]{10}$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.PHONE_NUMBER_INVALID,
                };
            }),

            "position": Joi.string().required(),

            "strong_foot": Joi.string().trim().min(1).valid(STRONG_FOOT.RIGHT, STRONG_FOOT.LEFT).required(),
            "weak_foot": Joi.number().min(1).max(5),

            "city": Joi.string().required(),
            "height_feet": Joi.string().trim().allow(""),
            'height_inches': Joi.string().trim().allow(""),
            "weight": Joi.string().trim().allow(""),

            "school": Joi.string().trim().allow(""),
            "college": Joi.string().trim().allow(""),
            "university": Joi.string().trim().allow(""),

            "head_coach_name": Joi.string().trim().allow(""),
            "head_coach_email": Joi.string().trim().email({ minDomainSegments: 2 }).allow(""),
            "head_coach_phone": Joi.string().trim().allow(""),
            "former_club": Joi.string().trim().allow(""),
            "aadhar_media_type": Joi.string().required().valid(AADHAR_MEDIA_TYPE.IMAGE, AADHAR_MEDIA_TYPE.PDF),
            "aadhar_number": Joi.string().required().regex(/^[0-9]{12}$/).error(() => {
                return {
                    message: RESPONSE_MESSAGE.AADHAR_NUMBER_INVALID,
                };
            }),
            //need to remove
            "player_employment_contract": Joi.any(),
            "associated_club": Joi.string()
        };

        if (req.body.player_type === PLAYER.AMATEUR || req.body.player_type === PLAYER.PROFESSIONAL) {
            playerRule.height_feet = Joi.string().trim().required();
            playerRule.height_inches = Joi.string().trim().required();
        }

        const playerSchema = Joi.object().keys(playerRule);
        const academySchema = Joi.object().keys(academyRule);

        var schema = academySchema;

        if (req.authUser.member_type == MEMBER.PLAYER) {
            schema = playerSchema;
        }

        try {
            await Joi.validate(req.body, schema);
            if (req.authUser.member_type == MEMBER.PLAYER && req.body.aadhar_number) {
                var verhoeff = require('node-verhoeff');
                if (!verhoeff.validateAadhaar(req.body.aadhar_number)) {
                    return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(RESPONSE_MESSAGE.AADHAR_NUMBER_INVALID)));
                }
            }
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async updateBioAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "bio": Joi.string().allow(""),
            "facebook": Joi.string().allow(""),
            "youtube": Joi.string().allow(""),
            "twitter": Joi.string().allow(""),
            "instagram": Joi.string().allow("")
        });

        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async playerListQueryValidation(req, res, next) {

        const query = Joi.object().keys({
            "page_no": Joi.number(),
            "page_size": Joi.number(),
            "sort_order": Joi.number().valid([SORT_ORDER.ASCENDING, SORT_ORDER.DESCENDING]),
            "sort_by": Joi.string(),
            "from": Joi.string(),
            "to": Joi.string(),
            "search": Joi.string(),
            "email": Joi.string(),
            "name": Joi.string(),
            "position": Joi.string(),
            "type": Joi.string(),
            "profile_status": Joi.string().valid([PROFILE.VERIFIED, PROFILE.NON_VERIFIED]),
            "email_verified": Joi.string().valid([EMAIL_VERIFIED.TRUE, EMAIL_VERIFIED.FALSE]),
        })
        try {

            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async clubAcademyListQueryValidation(req, res, next) {

        const query = Joi.object().keys({
            "page_no": Joi.number(),
            "page_size": Joi.number(),
            "sort_order": Joi.number().valid([SORT_ORDER.ASCENDING, SORT_ORDER.DESCENDING]),
            "sort_by": Joi.string(),
            "from": Joi.string(),
            "to": Joi.string(),
            "search": Joi.string(),
            "email": Joi.string(),
            "name": Joi.string(),
            "profile_status": Joi.string().valid([PROFILE.VERIFIED, PROFILE.NON_VERIFIED]),
            "email_verified": Joi.string().valid([EMAIL_VERIFIED.TRUE, EMAIL_VERIFIED.FALSE]),
        })
        try {

            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async memberSearchQueryValidation(req, res, next) {

        const query = Joi.object().keys({
            "search": Joi.string().trim().min(3),
            "page_size": Joi.number(),
            "page_no": Joi.number()
        })
        try {

            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new UserValidator();

