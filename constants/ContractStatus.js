class ContractStatus {
  static get ACTIVE() {
    return "active";
  }
  static get PENDING() {
    return "pending";
  }
  static get YET_TO_START() {
    return "yet_to_start";
  }
  static get COMPLETED() {
    return "completed";
  }
  static get DISAPPROVED() {
    return "disapproved";
  }
  static get REJECTED() {
    return "rejected";
  }
}

module.exports = ContractStatus;
