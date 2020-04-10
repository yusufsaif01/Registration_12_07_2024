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
        return "Email is required"
    }
    static get PASSWORD_REQUIRED() {
        return "Password is required"
    }
    static get TOKEN_REQUIRED() {
        return "Token is required"
    }
    static get OLD_PASSWORD_REQUIRED() {
        return "Old password is required"
    }
    static get OLD_PASSWORD_INCORRECT() {
        return "Old password is incorrect"
    }
    static get NEW_PASSWORD_REQUIRED() {
        return "New password is required"
    }
    static get CONFIRM_PASSWORD_REQUIRED() {
        return "Confirm password is required"
    }
    static get PASSWORDS_DO_NOT_MATCH() {
        return "Passwords do not match"
    }
}

module.exports = ResponseMessage