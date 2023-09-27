
class MemberTypeListResponseMapper {
    map(memberTypes) {
        let response = [];
        if (memberTypes.length) {
            memberTypes.forEach((memberType) => {
                let data = {
                    "id": memberType.id,
                    "category": memberType.category || "",
                    "sub_category": memberType.sub_category || ""
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = MemberTypeListResponseMapper;