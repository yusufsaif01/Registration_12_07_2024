const EmploymentContract = require("../schemas/EmploymentContractSchema");
const BaseUtility = require("./BaseUtility");

class EmploymentContractUtility extends BaseUtility {
  constructor() {
    super(EmploymentContract);
  }
}

module.exports = EmploymentContractUtility;
