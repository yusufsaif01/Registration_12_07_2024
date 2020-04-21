
class LocationListResponseMapper {
    map(locationStats) {
        let response = [];
        if (locationStats.length) {
            locationStats.forEach((locationStat) => {
                let data = {
                    "country": locationStat._id.country || "",
                    "no_of_state": locationStat._id.total_states || 0,
                    "no_of_city": locationStat.total_cities || 0
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = LocationListResponseMapper;