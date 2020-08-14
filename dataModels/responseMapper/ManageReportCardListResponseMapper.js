
class ManageReportCardListResponseMapper {
    map(records) {
        let response = [];
        if (records) {
            records.forEach((record) => {
                let data = {
                    "user_id": record.user_id,
                    "avatar": record.avatar_url || "-",
                    "name": (record.first_name || "") + " " + (record.last_name || ""),
                    "category": record.category || "-",
                    "total_report_cards": record.total_report_cards || 0,
                    "published_at": record.published_at || "",
                    "status": record.status || "",
                };
                data.name = String(data.name).trim().length > 0 ? String(data.name).trim() : "-";
                if (record.draft_report_card && record.draft_report_card.length && record.draft_report_card[0] && record.draft_report_card[0].id) {
                    data.id = record.draft_report_card[0].id;
                }
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = ManageReportCardListResponseMapper;