const uuidv4 = require("uuid/v4");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        name: {
            type: String
        },
        abbreviation: {
            type: String
        },
        abilities: [
            { type: Schema.Types.ObjectId, ref: 'ability' }
        ]
    },
    schemaName: "position",
    options: {
        timestamps: true
    }
};
