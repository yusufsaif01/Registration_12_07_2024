
class AttributeListResponseMapper {
    map(attributes) {
        let response = [];
        if (attributes.length) {
            attributes.forEach((attribute) => {
                let data = {
                    "id": attribute.id,
                    "name": attribute.name || ""
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = AttributeListResponseMapper;