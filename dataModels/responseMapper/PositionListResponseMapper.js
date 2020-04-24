
class PositionListResponseMapper {
    map(positions) {
        let response = [];
        if (positions.length) {
            positions.forEach((position) => {
                let data = {
                    "id": position.id,
                    "name": position.name || "",
                    "abbreviation": position.abbreviation || "",
                    "abilities": position.abilities || []
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = PositionListResponseMapper;