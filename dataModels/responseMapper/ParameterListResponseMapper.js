
class ParameterListResponseMapper {
    map(parameters) {
        let response = [];
        if (parameters.length) {
            parameters.forEach((parameter) => {
                let data = {
                    "id": parameter.id,
                    "name": parameter.name || ""
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = ParameterListResponseMapper;