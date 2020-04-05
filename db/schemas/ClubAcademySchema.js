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
        name: {
            type: String
        },
        type: {
            type: String,
            enum: ["club", "academy"]
        },
        founded_in: {
            type: String
        },
        state: {
            type: String
        },
        country: {
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
        email: {
            type: String
        },
        phone: {
            type: String
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
        trophies: [{
            name: { type: String },
            year: { type: String },
            position: { type: String },
            id: {
                type: String,
                required: true,
                default: function () {
                    return uuidv4()
                }
            }
        }],
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
        bio: {
            type: String
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
        }]
    },

    schemaName: "club_academy_details",

    options: {
        timestamps: true
    }

};
