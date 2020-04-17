class ResponseMessage {
    static get EMAIL_ALREADY_REGISTERED() {
        return "Email is already registered";
    }
    static get ACCOUNT_NOT_ACTIVATED() {
        return "Account is not activated";
    }
    static get ACTIVATION_LINK_EXPIRED() {
        return "Activation link expired";
    }
    static get EMAIL_NOT_VERIFIED() {
        return "Email is not verified";
    }
    static get USER_NOT_REGISTERED() {
        return "User is not registered";
    }
    static get USER_AUTHENTICATION_FAILED() {
        return "User authentication failed";
    }
    static get USER_NOT_FOUND() {
        return "User not found";
    }
    static get USER_BLOCKED() {
        return "User is blocked";
    }
    static get USER_INACTIVE() {
        return "User is not active";
    }
    static get USER_ALREADY_EXISTS() {
        return "User already exists";
    }
    static get EMAIL_REQUIRED() {
        return "Email is required"
    }
    static get USER_ID_REQUIRED() {
        return "User id is required"
    }
    static get FIRST_NAME_REQUIRED() {
        return "First name is required"
    }
    static get LAST_NAME_REQUIRED() {
        return "Last name is required"
    }
    static get NAME_REQUIRED() {
        return "Name is required"
    }
    static get PASSWORD_REQUIRED() {
        return "Password is required"
    }
    static get PASSWORD_ALREADY_CREATED() {
        return "Password already created"
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
    static get STATUS_ALREADY_ACTIVE() {
        return "Status is already active"
    }
    static get STATUS_ALREADY_BLOCKED() {
        return "Status is already blocked"
    }

}

module.exports = ResponseMessage