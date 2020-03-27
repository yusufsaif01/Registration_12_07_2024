const Joi = require('@hapi/joi');
const Promise = require("bluebird");
const errors = require('../../errors');

/**
 *
 *
 * @class AuthValidator
 */
class AuthValidator {

    /**
     *Creates an instance of AuthValidator.
     * @memberof AuthValidator
     */
    constructor(){

    }

    /**
     *
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns
     * @memberof AuthValidator
     */
    async userRegisterValidation(req, res, next) {
        const schema = Joi.object().keys({

           
            dob : Joi.string().required(),
            role : Joi.string(),
            state : Joi.string(),
            country : Joi.string(),
            phone : Joi.string(),
            user_id : Joi.string().alphanum().min(5).max(30).required(),
            name : Joi.string().alphanum().min(3).max(30).required(),
            password : Joi.string().alphanum().min(3).max(30).required(),
            email      : Joi.string().email({ minDomainSegments: 2 }).required(),
            username : Joi.string().alphanum().min(3).max(30).required()

        });

        const result = await Joi.validate(req.body, schema);

        if(result.error){
            return Promise.reject(new errors.ValidationFailed());
        }
        next();
    }

    async warehouseAdminRegisterValidation(req, res, next) {
        const schema = Joi.object().keys({

            warehouse : Joi.string().required(),
            location : Joi.string().required(),
            // department : Joi.string().required(),
            dob : Joi.string().required(),
            doj : Joi.string().required(),
            role : Joi.string().required(),
            vendor_id : Joi.string(),
            state : Joi.string(),
            country : Joi.string(),
            phone : Joi.string(),
            status       : Joi.string(),
            deleted_at : Joi.string(),
            user_id : Joi.string().alphanum().min(5).max(30),
            name : Joi.string(),
            email      : Joi.string().email({ minDomainSegments: 2 }),
            // username : Joi.string().alphanum().min(3).max(30)
        });

        const result = await Joi.validate(req.body, schema);

        if(result.error){
            return Promise.reject(new errors.ValidationFailed());
        }
        next();
    }

}


module.exports = new AuthValidator();
