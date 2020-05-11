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
    static get NOT_FOOTMATE() {
        return "Not_footmate";
    }
}

module.exports = ConnectionRequestStatus