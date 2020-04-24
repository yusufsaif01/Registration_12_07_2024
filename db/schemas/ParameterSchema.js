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
        ability_id: {
            type: String
        },
        name: {
            type: String
        }
    },
    schemaName: "parameter",
    options: {
        timestamps: true
    }
};
