
class AbilityListResponseMapper {
    map(abilities) {
        let response = [];
        if (abilities.length) {
            abilities.forEach((ability) => {
                let data = {
                    "id": ability.id,
                    "name": ability.name || ""
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = AbilityListResponseMapper;