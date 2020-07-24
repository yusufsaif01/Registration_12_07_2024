
class LocationListResponseMapper {
    map(locationStats) {
        let response = [];
        if (locationStats.length) {
            locationStats.forEach((locationStat) => {
                let data = {
                    "country": locationStat._id.country || "",
                    "country_id": locationStat._id.country_id,
                    "no_of_state": locationStat._id.total_states || 0,
                    "no_of_district": locationStat.total_districts || 0
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = LocationListResponseMapper;