module.exports = class VideoResponseMapper {
  static map(records) {
    return records.map((record) => {
      return {
        id: record.id,
        media: record.media,
        type: record.post_type,
        status: record.status,
        created_at: record.created_at,
        meta: {
          abilities: record.meta.abilities.map((ability) => ({
            ability: ability.ability_name,
            attributes: ability.attributes.map(
              (attribute) => attribute.attribute_name
            ),
          })),
        },
      };
    });
  }
};
