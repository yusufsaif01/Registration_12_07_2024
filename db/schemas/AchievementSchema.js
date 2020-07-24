const uuidv4 = require("uuid/v4");

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
        user_id: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        type: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        position: {
            type: String,
            default: "NA"
        },
        media_url: {
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
    schemaName: "achievements",
    options: {
        timestamps: true
    }
};
