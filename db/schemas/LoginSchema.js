const uuidv4 = require('uuid/v4');

module.exports = {
	fields: {
			user_id: {
			type: String,
			required: true,
			default: function () {
				return uuidv4()
			}
		},
		username: {
			type: String
		},
		password: {
			type: String
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'inactive'
		},
		token: {
			type: String
		},
		is_deleted: {
			type: Boolean,
			default: false
		},
		deleted_at: {
			type: Date
		},
		forgot_password_token: {
			type: String
		},
		is_first_time_login: {
			type: Boolean,
			default: true
		},
		is_email_verified: {
			type: Boolean,
			default: false
		},
		member_type: {
			type: String,
			enum: ["player", "club", "academy"]
		},
		role: {
            type: String,
            enum: ["admin","member"],
            default: 'admin'
        },
	},

	schemaName: "Login_details",

	options: {
		timestamps: true
	}

};
