module.exports = class WhitelistStatus {
  static get ACTIVE() {
    return "active";
  }
  static get INACTIVE() {
    return "inactive";
  }

  static get ALLOWED_STATUS() {
    return [this.ACTIVE, this.INACTIVE];
  }
};
