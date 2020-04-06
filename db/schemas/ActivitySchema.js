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
		type: {
			type: String,
			required: true
		},
		activity: {
			type: String,
			required: true
		},
	},
	schemaName: "activities",
	options: {
		timestamps: true
	}
};
