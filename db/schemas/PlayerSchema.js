const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const DocumentStatus = require('../../constants/DocumentStatus');
const AttachmentType = require('../../constants/AttachmentType');
const DocumentType = require('../../constants/DocumentType');

const Schema = mongoose.Schema;
const PLAYER = require('../../constants/PlayerType')

module.exports = {
    fields: {
        id: {
            type: String,
            required: true,
            unique: true,
            default: function () {
                return uuid()
            }
        },
        user_id: {
            type: String
        },
        nationality: {
            type: String
        },
        deleted_at: {
            type: Date
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
            inches: {
                type: String
            }
        },
        weight: {
            type: String,
        },
        dob: {
            type: String
        },
        country: {
            id: {
                type: String
            },
            name: {
                type: String
            }
        },
        state: {
            id: {
                type: String
            },
            name: {
                type: String
            }
        },
        city: {
            id: {
                type: String
            },
            name: {
                type: String
            }
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
            type: {
                type: String,
                enum: [
                    DocumentType.AADHAR,
                    DocumentType.PAN,
                    DocumentType.AIFF,
                    DocumentType.COI,
                    DocumentType.TIN,
                    DocumentType.EMPLOYEMENT_CONTRACT
                ]
            },
            added_on: {
                type: Date
            },
            document_number: {
                type: String
            },
            media: {
                attachment_type: {
                    type: String,
                    enum: [AttachmentType.IMAGE,AttachmentType.PDF]
                },
                doc_front: {
                    type: String
                },
                doc_back: {
                    type: String
                },
                user_photo: {
                    type: String
                },
                document: {
                    type: String
                }
            },
            status: {
                type: String,
                enum: [DocumentStatus.APPROVED, DocumentStatus.PENDING, DocumentStatus.DISAPPROVED]
            },
            remark:String
        }],
        bio: {
            type: String
        },
        position: [{
            priority: {
                type: String
            },
            name: {
                type: String
            },
            id: {
                type: String
            }
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
                PLAYER.GRASSROOT, PLAYER.AMATEUR, PLAYER.PROFESSIONAL
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
        },
        associated_club: {
            type: String
        },
        login_details: {
            type: Schema.Types.ObjectId, ref: 'login_details'
        }
    },

    schemaName: "player_details",

    options: {
        timestamps: true
    }

};
