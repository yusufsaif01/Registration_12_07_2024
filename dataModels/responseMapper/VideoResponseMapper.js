module.exports = class VideoResponseMapper {
  static map(records) {
    return records.map((record) => {
      return {
        id: record.id,
        media: record.media,
        type: record.post_type,
        status: record.status,
        created_at: record.created_at,
        posted_by: {
          member_type: record.posted_by[0] ? record.posted_by[0].role : "",
          user_id: record.posted_by[0] ? record.posted_by[0].user_id : "",
        },
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
