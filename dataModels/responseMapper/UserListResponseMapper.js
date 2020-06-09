const MEMBER = require('../../constants/MemberType')
class UserListResponseMapper {
    map(users, member_type) {
        let response = [];
        if (member_type === MEMBER.PLAYER) {
            users.forEach((user, index) => {
                let data = {
                    "name": (user.first_name || "") + " " + (user.last_name || ""),
                    "position": "-",
                    "type": user.player_type || "-",
                    "email": user.email || "-",
                    "status": "-",
                    "account_status": "-",
                    "is_email_verified": "false",
                    "user_id": user.user_id
                };

                data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";

                if (user.position && user.position.length > 0 && user.position[0] && user.position[0].name) {
                    data.position = user.position[0].name;
                }

                if (user.login_details && user.login_details.profile_status && user.login_details.profile_status.status) {
                    data.status = user.login_details.profile_status.status;
                }

                if (user.login_details && user.login_details.status) {
                    data.account_status = user.login_details.status;
                }

                if (user.login_details && user.login_details.is_email_verified) {
                    data.is_email_verified = "true";
                }

                response.push(data);
            });
        } else {
            users.forEach((user, index) => {
                let data = {
                    "name": user.name || "-",
                    "no_of_players": user.associated_players || 0,
                    "email": user.email || "-",
                    "status": "",
                    "account_status": "-",
                    "is_email_verified": "false",
                    "user_id": user.user_id
                };

                if (user.login_details && user.login_details.profile_status && user.login_details.profile_status.status) {
                    data.status = user.login_details.profile_status.status;
                }

                if (user.login_details && user.login_details.status) {
                    data.account_status = user.login_details.status;
                }

                if (user.login_details && user.login_details.is_email_verified) {
                    data.is_email_verified = "true";
                }
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = UserListResponseMapper;