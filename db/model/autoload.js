/**
 * Autolaoding modles on connection.
 */
const fs = require("fs");
const path = require("path");

const modelProvider = require("./index");

/**
 * location to load schmeas from.
 */
const schemaLocation = "db/schemas";

/**
 * Add all bootstraping schmeas to load when the
 * mongodb connection is initiated.
 *
 */
const autoloadModels = [require("../schemas/LoginSchema")];

module.exports = (autoloadAll = false) => {
  console.info("[+] Autoloading models...");
  if (autoloadAll) {
    return scanAndAutloadAll();
  }
  return loadModels(autoloadModels);
};


/**
 * Scans directory and autoload models
 */
function scanAndAutloadAll() {
  const schemaDirectory = path.join(__basedir, schemaLocation);
  console.log("[+] Scanning directory :", schemaDirectory);
  let schemas = fs.readdirSync(schemaDirectory);
  console.log("[+] Found", schemas.length, "schmeas");

  loadModels(
    schemas.map((schema) => {
      return require(`../schemas/${schema}`);
    })
  );
}

/**
 * Load models
 * @param {array} schemaList
 */
function loadModels(schemaList) {
  schemaList.forEach((modelSchema) => {
    try {
      modelProvider.getModel(modelSchema);
      console.log("-", modelSchema.schemaName, "loaded");
    } catch (error) {
      console.error("-", modelSchema.schemaName, "loading failed.");
    }
  });
}
