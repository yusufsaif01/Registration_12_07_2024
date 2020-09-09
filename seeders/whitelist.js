const db = require("../db");
const bcrypt = require("bcrypt");
const prompts = require("prompts");
const path = require("path");
const AccessTokenService = require("../services/AccessTokenService");
const accessTokenInst = new AccessTokenService();

let baseDir = path.resolve(__dirname);
global.__basedir = baseDir.split("seeders")[0];

const onCancel = (prompt) => {
  console.log("Closing app without whitelisting user");
  process.exit();
};

var whiteListSeeder = () => {
  const questions = [
    {
      type: "text",
      name: "name",
      message: "Enter Name",
    },
    {
      type: "text",
      name: "email",
      message: "Enter Email",
    },
    {
      type: "text",
      name: "phone",
      message: "Enter Phone",
    },
  ];

  (async () => {
    try {
      await db.connectDB();
      console.log("############# WHITELISTING USER ##############");
      const response = await prompts(questions, { onCancel });

      if (!response.email.length) {
        throw new Error("Email is required");
      }

      try {
        await accessTokenInst.whiteListUser(response);
      } catch (error) {
        console.log(error.message);
      }

      console.log("#############DONE##############");
      process.exit();
    } catch (err) {
      console.log("#############ERROR##############", err);
      process.exit(err);
    }
  })();
};

whiteListSeeder();
