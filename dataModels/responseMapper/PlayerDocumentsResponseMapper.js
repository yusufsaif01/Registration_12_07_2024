class PlayerDocumentsResponseMapper {
  map(record) {
    return {
      player_name: [record.first_name, record.last_name].join(" "),
      date_of_birth: record.dob,
      documents: record.documents,
    };
  }
}

module.exports = new PlayerDocumentsResponseMapper();
