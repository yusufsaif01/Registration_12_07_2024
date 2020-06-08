class PlayerDocumentsResponseMapper {
  map(record) {
    return {
      player_name: [record.first_name, record.last_name].join(" "),
      date_of_birth: record.dob,
      added_on: record.createdAt,
      documents: record.documents,
    };
  }
}

module.exports = new PlayerDocumentsResponseMapper();
