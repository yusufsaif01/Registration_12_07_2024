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
    static get FOUNDED_IN_GREATER_THAN_CURRENT_YEAR() {
        let d = new Date();
        let currentYear = d.getFullYear();
        return "Founded in is greater than " + currentYear
    }
    static get FOUNDED_IN_CANNOT_BE_NEGATIVE() {
        return "Founded in cannot be negative"
    }
    static get FOUNDED_IN_CANNOT_BE_ZERO() {
        return "Founded in cannot be zero"
    }
    static get TROPHY_YEAR_GREATER_THAN_CURRENT_YEAR() {
        let d = new Date();
        let currentYear = d.getFullYear();
        return "Trophy year is greater than " + currentYear
    }
    static get TROPHY_YEAR_CANNOT_BE_NEGATIVE() {
        return "Trophy year cannot be negative"
    }
    static get TROPHY_YEAR_CANNOT_BE_ZERO() {
        return "Trophy year cannot be zero"
    }
    static get INVALID_VALUE_CONTACT_PERSONS() {
        return "Invalid value for contact_persons"
    }
    static get INVALID_VALUE_TROPHIES() {
        return "Invalid value for trophies"
    }
    static get INVALID_VALUE_POSITION() {
        return "Invalid value for position"
    }
    static get INVALID_VALUE_TOP_PLAYERS() {
        return "Invalid value for top players"
    }
    static get INVALID_VALUE_OWNER() {
        return "Invalid value for owner"
    }
    static get INVALID_VALUE_MANAGER() {
        return "Invalid value for manager"
    }
    static get INVALID_VALUE_TOP_SIGNINGS() {
        return "Invalid value for top_signings"
    }
    
}

module.exports = ResponseMessage