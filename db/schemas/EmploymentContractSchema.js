const Role = require("../../constants/Role");
const uuidv4 = require("uuid/v4");
const contractStatus = require("../../constants/ContractStatus");
module.exports = {
  fields: {
    id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return uuidv4();
      },
    },
    status: {
      type: String,
      enum: [
        contractStatus.ACTIVE,
        contractStatus.COMPLETED,
        contractStatus.PENDING,
        contractStatus.YET_TO_START,
        contractStatus.DISAPPROVED,
        contractStatus.REJECTED,
      ],
    },
    send_to: {
      type: String,
    },
    sent_by: {
      type: String,
    },
    player_name: String,
    category: {
      type: String,
      enum: [Role.CLUB, Role.ACADEMY],
    },

    club_academy_name: String,
    signing_date: Date,
    effective_date: Date,
    expiry_date: Date,
    place_of_signature: String,
    club_academy_representative_name: String,
    club_academy_address: String,
    club_academy_phone_number: String,
    club_academy_email: String,
    aiff_number: String,
    crs_user_name: String,

    legal_guardian_name: String,
    player_address: String,
    player_mobile_number: String,
    player_email: String,

    club_academy_uses_agent_services: {
      type: Boolean,
      default: false,
    },
    club_academy_intermediary_name: String,
    club_academy_transfer_fee: String,

    player_uses_agent_services: {
      type: Boolean,
      default: false,
    },
    player_intermediary_name: String,
    player_transfer_fee: String,

    other_name: String,
    other_email: String,
    other_phone_number: String,

    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  schemaName: "employment_contract",
  options: {
    timestamps: true,
  },
};
