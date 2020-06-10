/**
 * Autolaoding modles on connection.
 */
const fs = require("fs");

const modelProvider = require("./index");
const LoginSchema = require("../schemas/LoginSchema");

/**
 * Add all bootstraping schmeas to load when the
 * mongodb connection is initiated.
 *
 */
const autoloadModels = [LoginSchema];

module.exports = () => {
  console.info("[+] Autoloading models...");
  autoloadModels.forEach((modelSchema) => {
    modelProvider.getModel(modelSchema);
    console.log("-", modelSchema.schemaName, "Loaded");
  });
};
