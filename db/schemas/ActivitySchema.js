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
		user_id       : {
			type     : String,
			required : true
		},
		activity_type: {
			type     : String,
			required : true
		},
		activity_time        : {
			type     : Date,
			required : true
		},
	},
	schemaName: "Activities",
	options: {
		timestamps: true
	}
};
