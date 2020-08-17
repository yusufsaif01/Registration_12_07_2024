const Joi = require('@hapi/joi');
const errors = require("../../errors");
const responseHandler = require("../../ResponseHandler");
const RESPONSE_MESSAGE = require('../../constants/ResponseMessage');
const REPORT_CARD_STATUS = require('../../constants/ReportCardStatus');
const moment = require("moment");

class ReportCardValidator {

    async manageReportCardListValidation(req, res, next) {
        const query = Joi.object().keys({
            "page_size": Joi.number(),
            "page_no": Joi.number(),
            "sort_order": Joi.number().valid([1, -1]),
            "sort_by": Joi.string().valid(['name', 'category', 'total_report_cards', 'published_at', 'status']),
            "search": Joi.string(),
            "player_category": Joi.string(),
            "from": Joi.date().iso().max(moment().format("YYYY-MM-DD")),
            "to": Joi.date().iso().max(moment().format("YYYY-MM-DD")).min(Joi.ref("from")),
            "status": Joi.string(),
        });
        try {
            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async createReportCardValidation(reqObj) {
        const schema = Joi.object().keys({
            send_to: Joi.string().required(),
            remarks: Joi.string(),
            status: Joi.string().valid([REPORT_CARD_STATUS.PUBLISHED, REPORT_CARD_STATUS.DRAFT]).required(),
            abilities: Joi.array().required()
                .items({
                    ability_id: Joi.string().required(),
                    attributes: Joi.array().required().items({
                        attribute_id: Joi.string().required(),
                        attribute_score: Joi.number().min(0).max(99).required()
                    })
                })
        })
        try {
            await Joi.validate(reqObj, schema);
            return Promise.resolve()
        } catch (err) {
            console.log(err.details);
            return Promise.reject(new errors.ValidationFailed(err.details[0].message));
        }
    }

    async editReportCardValidation(reqObj) {
        const schema = Joi.object().keys({
            remarks: Joi.string(),
            status: Joi.string().valid([REPORT_CARD_STATUS.PUBLISHED, REPORT_CARD_STATUS.DRAFT]).required(),
            abilities: Joi.array().required()
                .items({
                    ability_id: Joi.string().required(),
                    attributes: Joi.array().required().items({
                        attribute_id: Joi.string().required(),
                        attribute_score: Joi.number().min(0).max(99).required()
                    })
                })
        })
        try {
            await Joi.validate(reqObj, schema);
            return Promise.resolve()
        } catch (err) {
            console.log(err.details);
            return Promise.reject(new errors.ValidationFailed(err.details[0].message));
        }
    }

    async managePlayerReportCardListValidation(req, res, next) {
        const query = Joi.object().keys({
            "page_size": Joi.number(),
            "page_no": Joi.number(),
        });
        try {
            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }

    async playerReportCardListValidation(req, res, next) {
        const query = Joi.object().keys({
            "page_size": Joi.number(),
            "page_no": Joi.number(),
            "sort_order": Joi.number().valid([1, -1]),
            "sort_by": Joi.string().valid(['name', 'created_by', 'published_at']),
            "search": Joi.string(),
            "created_by": Joi.string(),
            "from": Joi.date().iso().max(moment().format("YYYY-MM-DD")),
            "to": Joi.date().iso().max(moment().format("YYYY-MM-DD")).min(Joi.ref("from")),
            "name": Joi.string(),
        });
        try {
            await Joi.validate(req.query, query);
            return next();
        } catch (err) {
            console.log(err.details);
            return responseHandler(req, res, Promise.reject(new errors.ValidationFailed(err.details[0].message)));
        }
    }
}

module.exports = new ReportCardValidator();