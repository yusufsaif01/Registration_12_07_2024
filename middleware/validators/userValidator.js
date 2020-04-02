const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");

class UserValidator {

    async createAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            /**
             * Add your validations here
             */
            // "role" : Joi.string(),
            "state": Joi.string().required(),
            "country": Joi.string().required(),
            "phone": Joi.string().min(10).required(),
            "member_type": Joi.string().valid("player", "club", "academy").required(),
            // "dob" : Joi.string().min(8).max(30),
            "name": Joi.string().min(1),
            "first_name": Joi.string().min(1),
            "last_name": Joi.string().min(1),
            // "registration_number": Joi.string().alphanum().min(3).max(30),

            // "password": Joi.string().alphanum().min(3).max(30).required(),
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
            /**
             * Add your validations here
             */
            "contact_person_name": Joi.string(),
            "contact_person_email": Joi.string().email({ minDomainSegments: 2 }),
            "contact_person_phone_number": Joi.string().min(10),
            "contact_person_designation": Joi.string(),
            "name": Joi.string(),
            "short_name": Joi.string(),
            "founded_in": Joi.number(),
            "state": Joi.string(),
            "country": Joi.string(),
            "city": Joi.string(),
            "pincode": Joi.string(),
            "country": Joi.string(),
            "address": Joi.string(),
            "city": Joi.string(),
            "phone": Joi.string().min(10),
            "stadium": Joi.string(),
            "owner": Joi.string(),
            "manager": Joi.string(),
            "document_type": Joi.string(),
            "trophie_name": Joi.string(),
            "trophie_year": Joi.string(),
            "trophie_position": Joi.string(),
            "top_players": Joi.array(),
            "associated_players": Joi.number(),
            "head_coach": Joi.string(),
            "head_coach_email": Joi.string(),
            "head_coach_phone": Joi.string()

        });
        const playerSchema = Joi.object().keys({
            /**
             * Add your validations here
             */



            "player_type": Joi.string().valid("grassroot", "amateur", "professional"),
            "first_name": Joi.string(),
            "last_name": Joi.string(),
            "dob": Joi.string(),
            "height": Joi.string(),
            "weight": Joi.string(),
            "country": Joi.string(),
            "nationality": Joi.string(),
            "state": Joi.string(),
            "city": Joi.string(),
            "school": Joi.string(),
            "college": Joi.string(),
            "university": Joi.string(),
            "phone": Joi.string().min(10),
            "position_priority": Joi.string(),
            "position_name": Joi.string(),
            "strong_foot": Joi.string(),
            "weak_foot": Joi.string(),
            "head_coach": Joi.string(),
            "head_coach_email": Joi.string(),
            "head_coach_phone": Joi.string(),
            // "club": Joi.string().valid('yes', 'no').required(),
            "former_club": Joi.string()

        });
        var schema;
        if (req.authUser.member_type == 'player') {
            schema = playerSchema;
        }
        else {
            schema = academySchema;
        }

        try {
            // await Joi.validate(req.body.trophies, trophieSchema);
            await Joi.validate(req.body, schema);

            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
    async updateBioAPIValidation(req, res, next) {
        const schema = Joi.object().keys({
            /**
             * Add your validations here
             */
            "about": Joi.string(),
            "bio": Joi.string(),
                "facebook": Joi.string(),
                "youtube": Joi.string(),
                "twitter": Joi.string(),
                "instagram": Joi.string(),
                "github": Joi.string()
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

