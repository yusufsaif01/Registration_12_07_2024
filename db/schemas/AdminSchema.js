const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
    fields: {
        user_id: {
            type: String,
            required: true,
            default: function () {
                return uuid()
            }
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        avatar_url: {
            type: String
        },
        login_details: {
            type: Schema.Types.ObjectId, ref: 'login_details'
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        deleted_at: {
            type: Date
        }
    },

    schemaName: "admin_details",

    options: {
        timestamps: true
    }

};
