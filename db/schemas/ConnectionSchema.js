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
        }
    },
    schemaName: "Connections",
    options: {
        timestamps: true
    }
};
