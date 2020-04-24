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
        category: {
            type: String
        },
        sub_category: {
            type: String
        }
    },
    schemaName: "member_type",
    options: {
        timestamps: true
    }
};
