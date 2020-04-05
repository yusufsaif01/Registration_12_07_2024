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
            "name": Joi.string().trim().min(1).required(),
            "founded_in": Joi.number().min(1).required(),
            "country": Joi.string().trim().min(1).required(),
            "city": Joi.string().trim().required(),
            "state": Joi.string().trim().required(),
            "phone": Joi.string().trim().min(10).required(),
            "email": Joi.string().trim().email({ minDomainSegments: 2 }).required(),

            "short_name": Joi.string().trim().allow(""),
            "pincode": Joi.string().trim().allow(""),
            "address": Joi.string().trim().allow(""),
            "stadium_name": Joi.string().trim().allow(""),
            "document_type": Joi.string().trim().allow(""),
            "associated_players": Joi.number().allow(""),
            "head_coach": Joi.string().trim().allow(""),
            "head_coach_email": Joi.string().trim().email({ minDomainSegments: 2 }).allow(""),
            "head_coach_phone": Joi.string().trim().allow(""),

            "owner": Joi.object().keys({
                "name": Joi.string().trim().min(1),
                "email": Joi.string().trim().email({ minDomainSegments: 2 }),
                "phone": Joi.string().trim().min(10)
            }),
            "manager": Joi.object().keys({
                "name": Joi.string().trim().min(1),
                "email": Joi.string().trim().email({ minDomainSegments: 2 }),
                "phone": Joi.string().trim().min(10)
            }),
            "top_signings": Joi.array().items(Joi.object().keys({
                "name": Joi.string().trim().min(1)
            })),
            "league": Joi.string().trim().min(1),
            "contact_person": Joi.array().items(Joi.object().keys({
                "name": Joi.string().trim().min(1),
                "email": Joi.string().trim().email({ minDomainSegments: 2 }),
                "phone": Joi.string().trim().min(10),
                "designation": Joi.string().trim()
            })),
            "trophies": Joi.array().items(Joi.object().keys({
                "name": Joi.string().trim().min(1),
                "year": Joi.number().min(1),
                "position": Joi.number().min(1)
            })),
            "top_players": Joi.array().items(Joi.object().keys({
                "name": Joi.string().trim().min(1)
            })),
        });

        let playerRule = {
            "player_type": Joi.string().trim().min(1).valid("grassroot", "amateur", "professional").required(),
            "first_name": Joi.string().trim().min(1).max(500).required(),
            "last_name": Joi.string().trim().min(1).max(500).required(),
            "dob": Joi.string().trim().required(),
            "country": Joi.string().trim().min(1).required(),
            "state": Joi.string().trim().min(1).required(),
            "phone": Joi.string().trim().min(10).required(),
            "email": Joi.string().trim().email({ minDomainSegments: 2 }).required(),

            "position": Joi.array().items(Joi.object().keys({
                "priority": Joi.string().trim().min(1).required(),
                "name": Joi.string().trim().min(1).required()
            })).required(),

            "strong_foot": Joi.string().trim().min(1).valid("right", "left").required(),
            "weak_foot": Joi.number().min(1).max(5),

            "city": Joi.string().trim().allow(""),
            "height_feet": Joi.string().trim().allow(""),
            'height_inches': Joi.string().trim().allow(""),
            "weight": Joi.string().trim().allow(""),

            "school": Joi.string().trim().allow(""),
            "college": Joi.string().trim().allow(""),
            "university": Joi.string().trim().allow(""),

            "head_coach": Joi.string().trim().allow(""),
            "head_coach_email": Joi.string().trim().email({ minDomainSegments: 2 }).allow(""),
            "head_coach_phone": Joi.string().trim().allow(""),
            "former_club": Joi.string().trim().allow("")
        };

        if (req.body.player_type === "amateur") {
            playerRule.height_feet = Joi.string().trim().required();
            playerRule.height_inches = Joi.string().trim().required();
            playerRule.city = Joi.string().trim().required();
        }

        const playerSchema = Joi.object().keys(playerRule);

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
}

module.exports = new UserValidator();

