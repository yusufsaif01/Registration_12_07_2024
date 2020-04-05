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
            type: String
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
            feet: {
                type: String
            },
            inches: { type: String }
        },
        weight: {
            type: String,
        },
        dob: {
            type: String
        },
        country: {
            type: String
        },
        state: {
            type: String
        },
        city: {
            type: String
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        institute: {
            school: {
                type: String
            },
            college: {
                type: String
            },
            university: {
                type: String
            }
        },
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
        club_academy_details: {
            head_coach_name: {
                type: String
            },
            head_coach_phone: {
                type: String
            },
            head_coach_email: {
                type: String
            }
        },
        former_club: {
            type: String
        },
        former_academy: {
            type: String
        },
        player_type: {
            type: String,
            enum: [
                "grassroot", "amateur", "professional"
            ]
        },
        avatar_url: {
            type: String
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
            }
        }
    },

    schemaName: "player_details",

    options: {
        timestamps: true
    }

};
