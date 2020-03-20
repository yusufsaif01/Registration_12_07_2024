
class UserListResponseMapper {
    map(users) {
        let response = [];
        users.forEach(user => {
            let data = {
                "id": user.id,
                "name": user.name,
                "role": user.role,
                "department": user.department,
                "user_id": user.user_id,
                "status": user.status
            };

            response.push(data);
        });
        return response;
    }
}

module.exports = UserListResponseMapper;