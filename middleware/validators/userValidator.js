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
        const trophieSchema = Joi.object().keys({
            "name": Joi.string(),
            "year": Joi.string(),
            "position": Joi.string()
        });

        const academySchema = Joi.object().keys({
            /**
             * Add your validations here
             */


            // "dob" : Joi.string().min(8).max(30),
            "contact_person": Joi.array().items(Joi.object().keys({ 
                "name": Joi.string(),
                "email": Joi.string().email({ minDomainSegments: 2 }),
                "phone_number": Joi.string().min(10),
                "designation":Joi.string()
            }))
           ,
            "name": Joi.string(),
            "short_name": Joi.string(),
            "founded_in": Joi.number(),
            "state": Joi.string(),
            "country": Joi.string(),
            "city": Joi.string(),
            "address": Joi.object().keys({
              "full_address":Joi.string(),
              "pincode": Joi.string(),
              "country": Joi.string(),
            "city": Joi.string()

            }),
            
            "phone": Joi.string().min(10),
            "stadium": Joi.string(),
            "owner": Joi.object().keys({ 
                "name": Joi.string(),
                "email": Joi.string().email({ minDomainSegments: 2 }),
                "phone_number": Joi.string().min(10),
            }),
            "manager": Joi.object().keys({ 
                "name": Joi.string(),
                "email": Joi.string().email({ minDomainSegments: 2 }),
                "phone_number": Joi.string().min(10),
            }),
            "documents": Joi.array().items(Joi.object().keys({
                "link":Joi.string(),
                "is_verified":Joi.string(),
                "type":Joi.string()
            })),
            "trophies": Joi.array().items(trophieSchema),
            "top_players": Joi.array(),
            "associated_players": Joi.number(),
            "club_academy_details":Joi.object().keys({
                "head_coach": Joi.string(),
                "head_coach_email": Joi.string(),
                "head_coach_phone": Joi.string(),
            })

        });
        const playerSchema = Joi.object().keys({
            /**
             * Add your validations here
             */



            "player_type": Joi.string().valid("grassroot", "amateur", "professional"),
            "first_name": Joi.string(),
            "last_name": Joi.string(),
            "dob": Joi.string().min(8),
            "height": Joi.string(),
            "weight": Joi.string(),
            "country": Joi.string(),
            "state": Joi.string(),
            "city": Joi.string(),
            "institute":Joi.object().keys({
                "school": Joi.string(),
            "college": Joi.string(),
            "university": Joi.string()
            }),
            "phone": Joi.string().min(10),
            "position": Joi.object().keys({
                "priority": Joi.string(),
                "name": Joi.string()
            }),
            "strong_foot": Joi.string(),
            "weak_foot": Joi.string(),
            "documents": Joi.array().items(Joi.object().keys({
                "link":Joi.string(),
                "is_verified":Joi.string(),
                "type":Joi.string()
            })),
            "employment_contract": Joi.string(),
            "club_academy_details":Joi.object().keys({
                "head_coach": Joi.string(),
                "head_coach_email": Joi.string(),
                "head_coach_phone": Joi.string()
            }),
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
            "social_profiles":Joi.object().keys({ 
                "facebook": Joi.string(),
                "youtube": Joi.string(),
                "twitter": Joi.string(),
                "instagram": Joi.string(),
                "github": Joi.string()
            })
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

