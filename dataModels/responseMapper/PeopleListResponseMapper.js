const moment = require("moment");
// const _ = require('lodash')

function getAiffNumber(record) {
  if (record.documentsRequired && record.documentsRequired.length) {
    return record.documentsRequired[0].document_number;
  }

  return "";
}

function calculateAge(record) {
  let dob = record.userDetail.dob || "1970-01-01";
  return moment().diff(dob, "years");
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
  mapOne(request) {
    let response = {
      user_id: request.user_id,
      name: [request.userDetail.first_name, request.userDetail.last_name].join(" "),
      email: request.userDetail.email,
      // address: _.get(request, "userDetail.address.full_address", ''),
      mobile: request.userDetail.phone || "",
      age: calculateAge(request),
    };
    return response;
  }
}

module.exports = PeopleListResponseMapper;
