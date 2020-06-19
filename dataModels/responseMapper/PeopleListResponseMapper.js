class PeopleListResponseMapper {
  map(requests) {
    let response = [];
    if (requests.length) {
      requests.forEach((request) => {
        let data = {
          user_id: request.user_id,
          name: request.userDetail[0].name,
          email: request.userDetail[0].email,
        };
        response.push(data);
      });
    }
    return response;
  }
}

module.exports = PeopleListResponseMapper;
