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
            "phone": Joi.string().min(10).required().max(10),
            "user_id": Joi.string().alphanum().min(5).max(30).required(),
            "member_type": Joi.string().valid("player", "club", "academy").required(),
            // "dob" : Joi.string().min(8).max(30),
            "name": Joi.string().alphanum().min(3).max(30),
            "first_name": Joi.string().min(3).max(30),
            "last_name": Joi.string().min(3).max(30),
            "registration_number": Joi.string().alphanum().min(3).max(30),

            "password": Joi.string().alphanum().min(3).max(30).required(),
            "email": Joi.string().email({ minDomainSegments: 2 }).required(),
            "username": Joi.string().alphanum().min(3).max(30).required()
        });

        try {
            await Joi.validate(req.body, schema);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async updateAPIValidation(req, res, next) {
        const trophieSchema = Joi.object().keys({
            "trophie_name": Joi.string().required(),
            "year": Joi.string().min(4).required().max(4),
            "position": Joi.string().required()
        });

        const academySchema = Joi.object().keys({
            /**
             * Add your validations here
             */


            // "dob" : Joi.string().min(8).max(30),

            "contact_person_name": Joi.string().min(3).max(30).required(),
            "contact_person_email": Joi.string().email({ minDomainSegments: 2 }).required(),
            "contact_person_phone": Joi.string().min(10).required().max(10),
            "name": Joi.string().min(3).max(30).required(),
            "short_name": Joi.string().min(3).max(30).required(),
            "founded_in": Joi.string().min(4).required().max(4),
            "state": Joi.string().required(),
            "country": Joi.string().required(),
            "city": Joi.string().required(),
            "address": Joi.string().min(3).max(50).required(),
            "pincode": Joi.string().required(),
            "phone": Joi.string().min(10).required().max(10),
            "stadium": Joi.string().min(3).max(30).required(),
            "owner": Joi.string().min(3).max(30).required(),
            "manager": Joi.string().min(3).max(30).required(),
            "document_link": Joi.string().required(),
            "about": Joi.string().required(),
            "bio": Joi.string().required(),
            "trophies": Joi.array().items(trophieSchema).required().min(1),
            "top_players": Joi.array().required().min(1),
            "total_associated_players": Joi.number().required(),
            "head_coach": Joi.string().min(3).required(),
            "social_profiles":Joi.object().keys({ 
                "facebook": Joi.string(),
                "youtube": Joi.string(),
                "twitter": Joi.string(),
                "instagram": Joi.string(),
                "github": Joi.string()
            })

        });
        const playerSchema = Joi.object().keys({
            /**
             * Add your validations here
             */



            "player_type": Joi.string().valid("grassroot", "amateur", "professional").required(),
            "first_name": Joi.string().min(3).max(30).required(),
            "last_name": Joi.string().min(3).required().max(30),
            "dob": Joi.string().min(8).max(30),
            "height": Joi.string().required(),
            "weight": Joi.string(),
            "country": Joi.string().required(),
            "state": Joi.string().required(),
            "city": Joi.string().required(),
            "school": Joi.string().min(3).max(30),
            "college": Joi.string().min(3).max(30),
            "university": Joi.string().min(3).max(30),
            "phone": Joi.string().min(10).required().max(10),
            "position": Joi.object().keys({
                "first_priority": Joi.string().min(3).required().max(30),
                "second_priority": Joi.string().min(3).required().max(30),
                "third_priority": Joi.string().min(3).required().max(30)

            }).required(),
            "strong_foot": Joi.string().min(4).max(30).required(),
            "weak_foot": Joi.string(),
            "document_link": Joi.string().required(),
            "employment_contract": Joi.string(),
            "head_coach_email": Joi.string().email({ minDomainSegments: 2 }),
            "head_coach_phone": Joi.string().min(10).max(10),
            "club": Joi.string().valid('yes', 'no').required(),
            "former_club": Joi.string().min(3).max(30),
            "about": Joi.string().required(),
            "bio": Joi.string().required(),
            "social_profiles":Joi.object().keys({ 
                "facebook": Joi.string(),
                "youtube": Joi.string(),
                "twitter": Joi.string(),
                "instagram": Joi.string(),
                "github": Joi.string()
            })
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
}

module.exports = new UserValidator();

