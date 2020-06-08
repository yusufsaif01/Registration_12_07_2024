class ClubAcademyDocumentResponseMapper {
  map(record) {
    return {
      name: [record.first_name, record.last_name].join(" "),
      documents: record.documents,
    };
  }
}

module.exports = new ClubAcademyDocumentResponseMapper();
