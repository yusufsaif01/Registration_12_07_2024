const uuidV4 = require("uuid/v4");

module.exports = {
  fields: {
    id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return uuidV4();
      },
    },
    post_id: {
      type: String,
    },
    uri: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  schemaName: "video_queue",
  options: {
    timestamps: true,
  },
};
