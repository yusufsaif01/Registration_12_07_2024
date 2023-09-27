const uuidv4 = require('uuid/v4');

module.exports = {
    fields: {
        id: {
            type: String,
            required: true,
            default: function () {
                return uuidv4()
            }
        },
        post_id: {
            type: String
        },
        comment: {
            type: String
        },
        commented_by: {
            type: String
        },
        created_at: {
            type: Date
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        deleted_at: {
            type: Date
        }
    },

    schemaName: "comments",

    options: {
        timestamps: true
    }

};
