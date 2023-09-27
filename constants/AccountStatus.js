class AccountStatus {
    static get ACTIVE() {
        return "active";
    }
    static get INACTIVE() {
        return "inactive";
    }
    static get PENDING() {
        return "pending";
    }
    static get BLOCKED() {
        return "blocked";
    }
}

module.exports = AccountStatus