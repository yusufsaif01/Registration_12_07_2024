const uuidv4 = require('uuid/v4');

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
			required: true,
			unique: true,
		},
		first_name: {
			type: String,
		},
		last_name: {
			type: String,
		},
		height: {
			type: String,
		},
		weight: {
			type: String,
		},

		dob: {
			type: String,
			required: true,
		},
		institute: {
			type: String
		},
		document_links: {
			type: String
		},
		about: {
			type: String
		},
		bio: {
			type: String
		},
		position: {
			type: String
		},
		strong_foot: {
			type: String
		},
		weak_foot: {
			type: String
		},
		club: {
			type: String
		},
		academy: {
			type: String
		},
		former_club: {
			type: String
		},
		former_academy: {
			type: String
		},
		specialization: {
			type: String
		},
		player_type: {
			type: String
		},
		role: {
			type: String,
			enum: [
				"admin"
			],
			default: 'admin'
		},
		email: {
			type: String,
			// required: true,
			// unique: true
		},
		password: {
			required: true,
			type: String,
		},
		username: {
			type: String,
			required: true,
			unique: true
		},
		token: {
			type: String,
		},
		forget_password_token: {
			type: String,
		},
		avatar_url: {
			type: String,
		},
		state: {
			type: String,
		},
		country: {
			type: String,
		},
		city: {
			type: String,
		},
		phone: {
			type: String,
		},
		member_type: {
			type: String,
		},
		social_profiles: {
			type: String,
		},

		is_first_time_login: {
			type: Boolean,
			default: true
		},
		is_email_verified: {
			type: Boolean,
			default: false
		},
		is_deleted: {
			type: Boolean,
			default: false
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active'
		},
		deleted_at: {
			type: Date
		},
	},

	schemaName: "Users",

	options: {
		timestamps: true
	}

};
