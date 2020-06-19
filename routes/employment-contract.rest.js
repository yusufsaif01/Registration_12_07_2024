const responseHandler = require("../ResponseHandler");
const { checkAuthToken, checkRole } = require("../middleware/auth");
const ROLE = require("../constants/Role");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const EmploymentContractService = require("../services/EmploymentContractService");

module.exports = (router) => {
  router.get("/employment-contract/list", (req, res, next) => {});
  router.get("/employment-contract/:id", (req, res, next) => {});
  router.post("/employment-contract", (req, res, next) => {});
  router.delete("/employment-contract/:id", (req, res, next) => {});
  router.put("/employment-contract/:id/status", (req, res, next) => {});
};
