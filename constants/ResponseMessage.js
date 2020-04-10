class ResponseMessage {
    static get EMAIL_ALREADY_REGISTERED() {
        return "Email is already registered";
    }
    static get ACCOUNT_NOT_ACTIVATED() {
        return "Account is not activated";
    }
    static get EMAIL_NOT_VERIFIED() {
        return "Email is not verified";
    }
    static get USER_NOT_REGISTERED() {
        return "User is not registered";
    }
    static get EMAIL_REQUIRED() {
        return "email is required.", { field_name: "email" }
    }
    static get PASSWORD_REQUIRED() {
        return "password is required.", { field_name: "password" }
    }
    static get TOKEN_REQUIRED() {
        return "token is required"
    }
    static get OLD_PASSWORD_REQUIRED() {
        return "Old password is incorrect", { field_name: "old_password"}
    }
}

module.exports = ResponseMessage