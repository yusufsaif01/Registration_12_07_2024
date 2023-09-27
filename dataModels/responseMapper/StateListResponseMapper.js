
class StateListResponseMapper {
    map(states) {
        let response = [];
        if (states.length) {
            states.forEach((state) => {
                let data = {
                    "name": state.name || "",
                    "id": state.id
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = StateListResponseMapper;