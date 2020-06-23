function getAiffNumber(record) {
  if (record.documentsRequired && record.documentsRequired.length) {
    return record.documentsRequired[0].document_number;
  }

  return "";
}

class PeopleListResponseMapper {
  map(requests) {
    let response = [];
    if (requests.length) {
      requests.forEach((request) => {
        let data = {
          user_id: request.user_id,
          name: request.userDetail.name,
          email: request.userDetail.email,
          address: request.userDetail.address || "",
          mobile: request.userDetail.mobile_number || "",
          aiffNumber: getAiffNumber(request.userDetail),
        };
        response.push(data);
      });
    }
    return response;
  }
}

module.exports = PeopleListResponseMapper;
