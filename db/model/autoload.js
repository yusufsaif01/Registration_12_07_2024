/**
 * Autolaoding modles on connection.
 */
const fs = require("fs");

const modelProvider = require("./index");

/**
 * Add all bootstraping schmeas to load when the
 * mongodb connection is initiated.
 *
 */
const autoloadModels = [
    require("../schemas/AbilitySchema"),
    require("../schemas/AchievementSchema"),
    require("../schemas/ActivitySchema"),
    require("../schemas/AdminSchema"),
    require("../schemas/CitySchema"),
    require("../schemas/ClubAcademySchema"),
    require("../schemas/CommentSchema"),
    require("../schemas/ConnectionRequestSchema"),
    require("../schemas/ConnectionSchema"),
    require("../schemas/CountrySchema"),
    require("../schemas/FootPlayerSchema"),
    require("../schemas/LikeSchema"),
    require("../schemas/LoginSchema"),
    require("../schemas/MemberTypeSchema"),
    require("../schemas/PlayerSchema"),
    require("../schemas/PositionSchema"),
    require("../schemas/PostSchema"),
    require("../schemas/StateSchema"),
];

module.exports = () => {
  console.info("[+] Autoloading models...");
  autoloadModels.forEach((modelSchema) => {
    try {
      modelProvider.getModel(modelSchema);
      console.log("-", modelSchema.schemaName, "loaded");
    } catch (error) {
      console.error("-", modelSchema.schemaName, "loading failed.");
    }
  });
};
