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
			default: function () {
				return uuidv4()
			}
		},
		nationality: {
			type: String
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
		institiute: {
			school: {
				type: String
			},
			college: {
				type: String
			},
			university: {
				type: String
			}
		}
		,
		documents: [{
			link: {
				type: String
			},
			is_verified: {
				type: Boolean,
				default: false
			},
			type: {
				type: String
			}
		}],
		about: {
			type: String
		},
		bio: {
			type: String
		},
		position: [{
			priority: { type: String },
			name: { type: String }
		}],
		strong_foot: {
			type: String
		},
		weak_foot: {
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
			type: String,
			enum: [
				"grassroot", "amateur", "professional"
			]
		},
		role: {
			type: String,
			enum: [
				"admin"
			],
			default: 'admin'
		},
		email: {
			type: String
		},
		password: {
			type: String
		},
		name: {
			type: String
		},
		username: {
			type: String
		},
		token: {
			type: String
		},
		forgot_password_token: {
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
		address: {
			full_address: {
				type: String
			},
			city: {
				type: String
			},
			country: {
				type: String
			},
			pincode: {
				type: String
			}
		},

		stadium_name: {
			type: String
		},
		owner: {
			name: {
				type: String
			},
			email: {
				type: String
			},
			phone_number: {
				type: String
			}
		},
		manager: {
			name: {
				type: String
			},
			email: {
				type: String
			},
			phone_number: {
				type: String
			}
		},
		short_name: {
			type: String
		},
		contact_person: [{
			name: {
				type: String
			},
			email: {
				type: String
			},
			phone_number: {
				type: String
			},
			designation: {
				type: String
			}

		}],

		trophies: [{
			name: { type: String },
			year: { type: String },
			position: { type: String },
			id: {
				type: String,
				default: function () {
					return uuidv4()
				}
			}
		}
		],


		club_academy_details: {
			head_coach: {
				type: String
			},
			head_coach_phone: {
				type: String
			},
			head_coach_email: {
				type: String
			}
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
			type: Number
		},
		registration_number: {
			type: String
		},

		member_type: {
			type: String,
			enum: ["player", "club", "academy"]
		},
		social_profiles: {
			facebook: {
				type: String
			},
			youtube: {
				type: String
			},
			twitter: {
				type: String
			},
			instagram: {
				type: String
			},
			github: {
				type: String
			}
		},

		is_first_time_login: {
			type: Boolean,
			default: true
		},
		is_email_verified: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			enum: ["club", "academy"]
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
