class DocumentStatus {
  static get PENDING() {
    return "pending";
  }
  static get APPROVED() {
    return "approved";
  }
  static get DISAPPROVED() {
    return "disapproved";
  }
}

module.exports = DocumentStatus;
