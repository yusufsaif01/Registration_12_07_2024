
class PlayerReportCardListResponseMapper {
    map(records) {
        let response = [];
        if (records) {
            records.forEach((record) => {
                let data = {
                    "id": record.id,
                    "sent_by": record.sent_by,
                    "name": record.name,
                    "created_by": record.created_by,
                    "published_at": record.published_at
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = PlayerReportCardListResponseMapper;