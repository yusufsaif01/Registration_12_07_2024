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
        posted_by: {
            type: String
        },
        media: {
            text: {
                type: String
            },
            media_url: {
                type: String
            },
            media_type: {
                type: String
            }
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
        },
        updated_at: {
            type: Date
        }
    },

    schemaName: "posts",

    options: {
        timestamps: true
    }

};
