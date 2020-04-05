const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");

class UserValidator {

    async createAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "state": Joi.string().required(),
            "country": Joi.string().required(),
            "phone": Joi.string().min(10).required(),
            "member_type": Joi.string().valid("player", "club", "academy").required(),
            "name": Joi.string().min(1),
            "first_name": Joi.string().min(1),
            "last_name": Joi.string().min(1),
            "email": Joi.string().email({ minDomainSegments: 2 }).required()
        });

        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async updateDetailsAPIValidation(req, res, next) {
        const academySchema = Joi.object().keys({
            "contact_person": Joi.string().allow(""),
            "trophies": Joi.string().allow(""),
            "contact_person_name": Joi.string(),
            "contact_person_email": Joi.string().email({ minDomainSegments: 2 }).allow(""),
            "contact_person_phone_number": Joi.string().min(10).allow(""),
            "contact_person_designation": Joi.string().allow(""),
            "name": Joi.string().allow(""),
            "short_name": Joi.string().allow(""),
            "founded_in": Joi.number().allow(""),
            "state": Joi.string().allow(""),
            "country": Joi.string().allow(""),
            "city": Joi.string().allow(""),
            "pincode": Joi.string().allow(""),
            "country": Joi.string().allow(""),
            "address": Joi.string().allow(""),
            "city": Joi.string().allow(""),
            "phone": Joi.string().min(10).allow(""),
            "stadium_name": Joi.string().allow(""),
            "document_type": Joi.string().allow(""),
            "trophie_name": Joi.string().allow(""),
            "trophie_year": Joi.string().allow(""),
            "trophie_position": Joi.string().allow(""),
            "top_players": Joi.array().allow(""),
            "associated_players": Joi.number().allow(""),
            "head_coach": Joi.string().allow(""),
            "head_coach_email": Joi.string().allow(""),
            "head_coach_phone": Joi.string().allow("")

        });
        const playerSchema = Joi.object().keys({
            "player_type": Joi.string().valid("grassroot", "amateur", "professional"),
            "first_name": Joi.string().allow(""),
            "last_name": Joi.string().allow(""),
            "dob": Joi.string().allow(""),
            "player_height_foot": Joi.string().allow(""),
            'player_height_inches': Joi.string().allow(""),
            "weight": Joi.string().allow(""),
            "country": Joi.string().allow(""),
            "nationality": Joi.string().allow(""),
            "state": Joi.string().allow(""),
            "city": Joi.string().allow(""),
            "school": Joi.string().allow(""),
            "college": Joi.string().allow(""),
            "university": Joi.string().allow(""),
            "phone": Joi.string().min(10).allow(""),
            "position_priority": Joi.string().allow(""),
            "position_name": Joi.string().allow(""),
            "strong_foot": Joi.string().allow(""),
            "weak_foot": Joi.string().allow(""),
            "head_coach": Joi.string().allow(""),
            "head_coach_email": Joi.string().allow(""),
            "head_coach_phone": Joi.string().allow(""),
            "former_club": Joi.string().allow('')

        });
        var schema = academySchema;
        
        if (req.authUser.member_type == 'player') {
            schema = playerSchema;
        }

        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async updateBioAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            "about": Joi.string().allow(""),
            "bio": Joi.string().allow(""),
            "facebook": Joi.string().allow(""),
            "youtube": Joi.string().allow(""),
            "twitter": Joi.string().allow(""),
            "instagram": Joi.string().allow(""),
            "github": Joi.string().allow("")
        });

        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new UserValidator();

