const uuidv4 = require("uuid/v4");

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
    otp: {
      type: String,
    },
    access_token: {
      type: String,
    },
    expiry: {
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
