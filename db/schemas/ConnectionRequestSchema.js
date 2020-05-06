const uuidv4 = require("uuid/v4");
const CONNECTION_REQUEST = require('../../constants/ConnectionRequestStatus')

module.exports = {
    fields: {
        request_id: {
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
            enum: [CONNECTION_REQUEST.ACCEPTED, CONNECTION_REQUEST.REJECTED, CONNECTION_REQUEST.PENDING]
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        deleted_at: {
            type: Date
        }
    },
    schemaName: "Connections",
    options: {
        timestamps: true
    }
};
