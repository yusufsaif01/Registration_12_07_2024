class ContractStatus {
  static get ACTIVE() {
    return "active";
  }
  static get PENDING() {
    return "pending";
  }
  static get YET_TO_START() {
    return "yet to start";
  }
  static get COMPLETED() {
    return "completed";
  }
  static get DISAPPROVED() {
    return "disapproved";
  }
}

module.exports = ContractStatus;
