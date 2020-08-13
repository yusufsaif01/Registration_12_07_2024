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
}

module.exports = new ReportCardValidator();