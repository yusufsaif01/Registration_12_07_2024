module.exports = {
    fields: {
        user_id: {
            type: String
        },
        footmates: {
            type: Array
        },
        followers: {
            type: Array
        },
        followings: {
            type: Array
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
