const responseHandler = require("../ResponseHandler");
const { checkAuthToken, checkRole } = require("../middleware/auth");
const ROLE = require("../constants/Role");
const errors = require("../errors");
const RESPONSE_MESSAGE = require("../constants/ResponseMessage");
const EmploymentContractService = require("../services/EmploymentContractService");
const employmentContractValidator = require("../middleware/validators/employmentContractValidator");

const contractService = new EmploymentContractService();

module.exports = (router) => {
  router.get("/employment-contract/list", (req, res, next) => {});
  router.get("/employment-contract/:id", (req, res, next) => {});

  router.post(
    "/employment-contract",
    checkAuthToken,
    employmentContractValidator.createValidator,
    (req, res, next) => {
      let body = req.body;

      return responseHandler(
        req,
        res,
        contractService.createContract(body, req.authUser)
      );
    }
  );

  router.delete("/employment-contract/:id", (req, res, next) => {});
  router.put("/employment-contract/:id/status", (req, res, next) => {});
};
