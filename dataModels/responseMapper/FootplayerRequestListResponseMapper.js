
class FootPlayerRequestListResponseMapper {
    map(members) {
        let response = [];
        if (members.length) {
            members.forEach((member) => {
                if (member.club_academy_detail) {
                    let data = {
                        "request_id": member.club_academy_detail.request_id,
                        "sent_by": member.club_academy_detail.user_id,
                        "avatar": member.club_academy_detail.avatar_url || "-",
                        "name": member.club_academy_detail.name,
                        "member_type": member.club_academy_detail.member_type,
                        "sub_category": member.club_academy_detail.type || "-"
                    };
                    response.push(data);
                }
            })
        }
        return response;
    }
}

module.exports = FootPlayerRequestListResponseMapper;