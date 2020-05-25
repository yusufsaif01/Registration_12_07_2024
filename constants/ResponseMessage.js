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
    static get LINK_EXPIRED() {
        return "Link has been expired";
    }
    static get EMAIL_NOT_VERIFIED() {
        return "Email is not verified";
    }
    static get USER_NOT_REGISTERED() {
        return "User is not registered";
    }
    static get USER_DELETED() {
        return "Your account has been deleted. Please contact admin for help";
    }
    static get USER_AUTHENTICATION_FAILED() {
        return "User authentication failed";
    }
    static get USER_NOT_FOUND() {
        return "User not found";
    }
    static get MEMBER_NOT_FOUND() {
        return "Member not found";
    }
    static get USER_BLOCKED() {
        return "Your account has been deactivated. Please contact admin for help";
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
    static get COUNTRY_NAME_REQUIRED() {
        return "Country name is required"
    }
    static get STATE_NAME_REQUIRED() {
        return "State name is required"
    }
    static get CITY_NAME_REQUIRED() {
        return "City name is required"
    }
    static get POSITION_NAME_REQUIRED() {
        return "Position name is required"
    }
    static get POSITION_ID_REQUIRED() {
        return "Position id is required"
    }
    static get POSITION_PRIORITY_REQUIRED() {
        return "Position priority is required"
    }
    static get COUNTRY_ID_REQUIRED() {
        return "Country id is required"
    }
    static get STATE_ID_REQUIRED() {
        return "State id is required"
    }
    static get CITY_ID_REQUIRED() {
        return "City id is required"
    }
    static get FIRST_NAME_INVALID() {
        return "First name is invalid"
    }
    static get LAST_NAME_INVALID() {
        return "Last name is invalid"
    }
    static get NAME_INVALID() {
        return "Name is invalid"
    }
    static get POSITION_INVALID() {
        return "Position is invalid"
    }
    static get PAN_NUMBER_INVALID() {
        return "PAN number is invalid"
    }
    static get TIN_NUMBER_INVALID() {
        return "TIN number is invalid"
    }
    static get COI_NUMBER_INVALID() {
        return "COI number is invalid"
    }
    static get ABBREVIATION_INVALID() {
        return "Abbreviation is invalid"
    }
    static get PHONE_NUMBER_INVALID() {
        return "Phone number is invalid"
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
    static get SAME_PASSWORD() {
        return "New password cannot be same as current password"
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
    static get YEAR_GREATER_THAN_CURRENT_YEAR() {
        let d = new Date();
        let currentYear = d.getFullYear();
        return "Year is greater than " + currentYear
    }
    static get YEAR_CANNOT_BE_NEGATIVE() {
        return "Year cannot be negative"
    }
    static get YEAR_CANNOT_BE_ZERO() {
        return "Year cannot be zero"
    }
    static get YEAR_REQUIRED() {
        return "Year is required"
    }
    static get YEAR_LESS_THAN_1970() {
        return "Year is less than 1970"
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
    static get INVALID_VALUE_COUNTRY() {
        return "Invalid value for country"
    }
    static get INVALID_VALUE_STATE() {
        return "Invalid value for state"
    }
    static get INVALID_VALUE_CITY() {
        return "Invalid value for city"
    }
    static get STATUS_ALREADY_ACTIVE() {
        return "Status is already active"
    }
    static get STATUS_ALREADY_BLOCKED() {
        return "Status is already blocked"
    }
    static get ACHIEVEMENT_NOT_FOUND() {
        return "Achievement not found"
    }
    static get COUNTRY_NOT_FOUND() {
        return "Country not found"
    }
    static get STATE_NOT_FOUND() {
        return "State not found"
    }
    static get CITY_NOT_FOUND() {
        return "City not found"
    }
    static get ABILITY_NOT_FOUND() {
        return "Ability not found"
    }
    static get PARAMETER_NOT_FOUND() {
        return "Parameter not found"
    }
    static get POSITION_NOT_FOUND() {
        return "Position not found"
    }
    static get STATE_ALREADY_ADDED() {
        return "State already added"
    }
    static get CITY_ALREADY_ADDED() {
        return "City already added"
    }
    static get ABILITY_ALREADY_ADDED() {
        return "Ability already added"
    }
    static get PARAMETER_ALREADY_ADDED() {
        return "Parameter already added"
    }
    static get POSITION_ALREADY_ADDED() {
        return "Position already added"
    }
    static get POSITION_WITH_SAME_NAME_ALREADY_ADDED() {
        return "Position with same name already added"
    }
    static get POSITION_WITH_SAME_ABBREVIATION_ALREADY_ADDED() {
        return "Position with same abbreviation already added"
    }
    static get NAME_CANNOT_BE_EMPTY() {
        return "Name cannot be empty"
    }
    static get ABBREVIATION_CANNOT_BE_EMPTY() {
        return "Abbreviation cannot be empty"
    }
    static get CANNOT_FOLLOW_YOURSELF() {
        return "Cannot follow yourself"
    }
    static get CANNOT_UNFOLLOW_YOURSELF() {
        return "Cannot unfollow yourself"
    }
    static get CANNOT_SEND_FOOTMATE_REQUEST_TO_YOURSELF() {
        return "Cannot send footmate request to yourself"
    }
    static get CANNOT_SEND_CANCEL_FOOTMATE_TO_YOURSELF() {
        return "Cannot send cancel footmate to yourself"
    }
    static get ONLY_PLAYER_CAN_SEND_FOOTMATE_REQUEST() {
        return "Only player can send footmate request"
    }
    static get ALREADY_UNFOLLOWED() {
        return "Already unfollowed"
    }
    static get ALREADY_CANCELLED_FOOTMATE() {
        return "Already cancelled footmate"
    }
    static get ALREADY_FOLLOWED() {
        return "Already followed"
    }
    static get MEMBER_TO_BE_FOLLOWED_NOT_FOUND() {
        return "Member to be followed not found"
    }
    static get MEMBER_TO_BE_UNFOLLOWED_NOT_FOUND() {
        return "Member to be unfollowed not found"
    }
    static get FOOTMATE_TO_BE_CANCELLED_NOT_FOUND() {
        return "Footmate to be cancelled not found"
    }
    static get MUTUAL_WITH_USER_NOT_FOUND() {
        return "Mutual with user not found"
    }
    static get MEMBER_TO_BE_FOOTMATE_NOT_FOUND() {
        return "Member to be footmate not found"
    }
    static get FOOTMATE_REQUEST_ALREADY_SENT() {
        return "Footmate request already sent"
    }
    static get FOOTMATE_REQUEST_NOT_FOUND() {
        return "Footmate request not found"
    }
    static get ALREADY_FOOTMATE() {
        return "Already footmate"
    }
    static get TEXT_OR_IMAGE_REQUIRED() {
        return "Text or image required"
    }
    static get POST_NOT_FOUND() {
        return "Post not found"
    }
    static get ALREADY_DISLIKED() {
        return "Already disliked"
    }
    static get YOU_DO_NOT_FOLLOW_THE_POST_OWNER() {
        return "You do not follow the post owner"
    }
    static get ALREADY_LIKED() {
        return "Already liked"
    }
    static get NOT_ALLOWED_TO_COMMENT() {
        return "Not allowed to comment"
    }
}

module.exports = ResponseMessage