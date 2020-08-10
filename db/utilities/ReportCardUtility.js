const ReportCardSchema = require("../schemas/ReportCardSchema");
const BaseUtility = require("./BaseUtility");

class ReportCardUtility extends BaseUtility {
    constructor() {
        super(ReportCardSchema);
    }
}

module.exports = ReportCardUtility;