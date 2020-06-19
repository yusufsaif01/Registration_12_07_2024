const ContractSchema = require("../schemas/ContractSchema");
const BaseUtility = require("./BaseUtility");

class ContractUtility extends BaseUtility {
  constructor() {
    super(ContractSchema);
  }
}

module.exports = ContractUtility;
