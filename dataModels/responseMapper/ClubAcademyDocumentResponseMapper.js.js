class ClubAcademyDocumentResponseMapper {
  map(record) {
    return {
      name: record.name,
      documents: record.documents,
    };
  }
}

module.exports = new ClubAcademyDocumentResponseMapper();
