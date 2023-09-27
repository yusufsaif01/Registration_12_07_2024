const { exec } = require("child_process");
/**
 * Calculates duration using ffprobe.
 * @param {string} filePath
 *
 * @returns {number} Duration in seconds
 */
module.exports = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `ffprobe -i ${filePath} -show_entries format=duration -v quiet -of csv="p=0"`,
      (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        if (stderr) {
          return reject(stderr);
        }
        return resolve(Number(stdout));
      }
    );
  });
};
