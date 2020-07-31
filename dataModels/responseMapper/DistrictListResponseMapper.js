
class DistrictListResponseMapper {
    map(districts) {
        let response = [];
        if (districts.length) {
            districts.forEach((district) => {
                let data = {
                    "name": district.name || "",
                    "id": district.id
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = DistrictListResponseMapper;