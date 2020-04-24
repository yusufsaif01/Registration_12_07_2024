
class CityListResponseMapper {
    map(cities) {
        let response = [];
        if (cities.length) {
            cities.forEach((city) => {
                let data = {
                    "name": city.name || "",
                    "id": city.id
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = CityListResponseMapper;