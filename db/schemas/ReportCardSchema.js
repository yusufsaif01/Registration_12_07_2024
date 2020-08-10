const uuidv4 = require("uuid/v4");
const REPORT_CARD_STATUS = require('../../constants/ReportCardStatus')

module.exports = {
    fields: {
        id: {
            type: String,
            required: true,
            unique: true,
            default: function () {
                return uuidv4()
            }
        },
        sent_by: {
            type: String
        },
        send_to: {
            type: String
        },
        status: {
            type: String,
            enum: [REPORT_CARD_STATUS.PUBLISHED, REPORT_CARD_STATUS.DRAFT],
        },
        abilities: [{
            ability_id: {
                type: String
            },
            ability_name: {
                type: String
            },
            attributes: [{
                attribute_id: {
                    type: String
                },
                attribute_name: {
                    type: String
                },
                attribute_score: {
                    type: Number
                }
            }]
        }],
        published_at: {
            type: Date
        },
        remarks: {
            type: String
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        deleted_at: {
            type: Date
        }
    },
    schemaName: "report_card",
    options: {
        timestamps: true
    }
};
