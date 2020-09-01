const uuidv4 = require("uuid/v4");
const WhitelistStatus = require("../../constants/WhitelistStatus");

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
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: WhitelistStatus.ALLOWED_STATUS,
    },
    otp: {
      type: String,
    },
    access_token: {
      type: String,
    },
    otp_expiry: {
      type: Date,
    },
    access_token_expiry: {
      type: Date,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaName: "access_whitelist",
  options: {
    timestamps: true,
  },
};
