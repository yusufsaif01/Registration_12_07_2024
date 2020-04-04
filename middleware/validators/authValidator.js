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

        

        });

        const result = await Joi.validate(req.body, schema);

        if(result.error){
            return Promise.reject(new errors.ValidationFailed());
        }
        next();
    }


}


module.exports = new AuthValidator();
