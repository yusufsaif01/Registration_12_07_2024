const BaseService = require("./BaseService");
const FootPlayerUtility = require("../db/utilities/FootPlayerUtility");
const PlayerUtility = require("../db/utilities/PlayerUtility");

class FootPlayerService extends BaseService {
  constructor() {
    super();
    this.footPlayerUtilityInst = new FootPlayerUtility();
    this.playerInst = new PlayerUtility();
  }

  countDocs(paramas = {}) {
    const matchCriteria = {
      sent_by: paramas.criteria.sentBy,
      is_deleted: false,
    };
    return this.footPlayerUtilityInst.countList(matchCriteria);
  }

  async listAll(paramas = {}) {
    const matchCriteria = {
      sent_by: paramas.criteria.sentBy,
      is_deleted: false,
    };

    let searchConditions = {};

    if (paramas.filters.search) {
      let regexp = new RegExp(paramas.filters.search, "i");

      searchConditions["$or"] = [];

      searchConditions["$or"] = [
        "send_to.f_name",
        "send_to.l_name",
        "send_to.full_name",
        "send_to_user.player_type",
      ].map((field) => {
        return {
          [field]: regexp,
        };
      });

      searchConditions["$or"].push({
        "send_to_user.position": {
          $elemMatch: {
            name: regexp,
            priority: "2",
          },
        },
      });
    }

    const projection = {
      $project: {
        id: 1,
        send_to_user: {
          position: 1,
          avatar_url: 1,
          player_type: 1,
        },
        status: 1,
        send_to: {
          full_name: {
            $concat: ["$send_to.f_name", " ", "$send_to.l_name"],
          },
          user_id: 1,
          f_name: 1,
          l_name: 1,
          email: 1,
          phone: 1,
        },
      },
    };

    let skipCount = (paramas.filters.page_no - 1) * paramas.filters.page_size;

    const aggPipes = [
      {
        $match: matchCriteria,
      },
      {
        $skip: parseInt(skipCount),
      },
      {
        $limit: parseInt(paramas.filters.page_size),
      },
      {
        $lookup: {
          from: "player_details",
          localField: "send_to.user_id",
          foreignField: "user_id",
          as: "send_to_user",
        },
      },
      {
        $unwind: {
          path: "$send_to_user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: searchConditions,
      },
      projection,
    ];
    return this.footPlayerUtilityInst.aggregate(aggPipes);
  }

  async createDummy({ sentBy, sendTo }) {
    let sendToUser = await this.playerInst.findOne({
      user_id: sendTo,
    });

    return this.footPlayerUtilityInst.insert({
      sent_by: sentBy,
      send_to: {
        user_id: sendTo,
        f_name: sendToUser.first_name,
        l_name: sendToUser.last_name,
        email: sendToUser.email,
        phone: sendToUser.phone,
      },
    });
  }
}

module.exports = FootPlayerService;
