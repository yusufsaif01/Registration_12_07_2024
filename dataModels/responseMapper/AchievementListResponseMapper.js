
class AchievementListResponseMapper {
    map(achievements) {
        let response = [];
         if(achievements.length){
            achievements.forEach((achievement) => {
                let data = {
                            "type": achievement.type,
                            "name": achievement.name || "",
                            "from": achievement.from,
                            "to": achievement.to,
                            "position": achievement.position || "",
                            "media": achievement.media_url || "",
                            "id": achievement.id
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = AchievementListResponseMapper;