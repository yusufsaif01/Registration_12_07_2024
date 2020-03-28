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
			type: String
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
			type: String
		},
		name:{
			type:String
		},
		username: {
			type: String,
			required: true,
			unique: true
		},
		token: {
			type: String
		},
		forget_password_token: {
			type: String
		},
		avatar_url: {
			type: String
		},
		state: {
			type: String
		},
		country: {
			type: String
		},
		city: {
			type: String
		},
		phone: {
			type: String
		},
		founded_in: {
			type: String
		},
		location: {
			type: String
		},
		address: {
			type: String
		},	
		stadium: {
			type: String
		},
		owner: {
			type: String
		},
		manager: {
			type: String
		},
		nick_name: {
			type: String
		},
		trophies: {
			type: Array
		},
		head_couch: {
			type: String
		},
		top_players: {
			type: Array
		},
		league: {
			type: String
		},
		top_signings: {
			type: Array
		},
		associated_players: {
			type: Array
		},
		registration_number: {
			type: String
		},
		
		member_type: {
			type: String,
			enum:["player","club","academy"]
		},
		social_profiles: {
			facebook: {
				type:String},
			youtube: {
				type:String},
			twitter: {
				type:String},
			instagram: {
				type:String},
			github: {
				type:String}
		},

		is_first_time_login: {
			type: Boolean,
			default: true
		},
		is_email_verified: {
			type: Boolean,
			default: false
		},
		type:{
            type: String,
			enum:["club","academy"]
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
