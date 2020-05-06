class ConnectionRequestStatus {
    static get ACCEPTED() {
        return "Accepted";
    }
    static get REJECTED() {
        return "Rejected";
    }
    static get PENDING() {
        return "Pending";
    }
}

module.exports = ConnectionRequestStatus