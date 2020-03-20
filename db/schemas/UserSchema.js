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
		name: {
			type: String,
		},
		warehouse: {
			type: String,
		},
		location: {
			type: String,
		},
		department: {
			type: String,
		},
		dob: {
			type: Date,
			required: true,
		},
		doj: {
			type: Date,
			required: true,
		},
		role: {
			type: String,
			enum: [
				"super-admin",
				"admin",
				"manager",
				"employee",
			],
			default: 'employee'
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
		vendor_id: {
			type: String,
		},
		token: {
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
		phone: {
			type: String,
		},
		is_logged_in: {
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
