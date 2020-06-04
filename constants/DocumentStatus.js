class DocumentStatus {
    static get APPROVED() {
        return "Approved";
    }
    static get DISAPPROVED() {
        return "Disapproved";
    }
    static get PENDING() {
        return "Pending";
    }
}

module.exports = DocumentStatus