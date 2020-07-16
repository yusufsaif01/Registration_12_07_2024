/**
 * Cron job for sending reminders for adding documents.
 *
 */
const LoginUtility = require("../../db/utilities/LoginUtility");
const ACCOUNT_STATUS = require("../../constants/AccountStatus");
const PROFILE_STATUS = require("../../constants/ProfileStatus");
const ROLE = require("../../constants/Role");
const UtilityService = require("../../services/UtilityService");
const EmailService = require("../../services/EmailService");
const config = require("../../config");
const PlayerUtility = require("../../db/utilities/PlayerUtility");
const ClubAcademyUtility = require("../../db/utilities/ClubAcademyUtility");

const playerInst = new PlayerUtility();
const clubAcademyInst = new ClubAcademyUtility();
const utilityInst = new UtilityService();
const emailService = new EmailService();

module.exports = async () => {
};

const pipeLines = () => {
  return [
    {
      $match: { documents: { $size: 0 } },
    },
    {
      $lookup: {
        from: "login_details",
        localField: "user_id",
        foreignField: "user_id",
        as: "login_details",
      },
    },
    {
      $match:{
        login_details:{
          $elemMatch : {
            status: ACCOUNT_STATUS.ACTIVE,
            'profile_status.status': PROFILE_STATUS.NON_VERIFIED
          }
        }
      }
    }
  ];
};

const loginDetailsProjection = {
  username: 1,
  role: 1,
  status: 1,
  profile_status: 1,
};

async function getPlayers() {
  let pipelines = pipeLines();
  pipelines.push({
    $project: {
      first_name: 1,
      last_name: 1,
      login_details: loginDetailsProjection,
    },
  });
  return await playerInst.aggregate(pipelines);
}
async function getClubAcademy() {
  let pipelines = pipeLines();
  pipelines.push({
    $project: {
      name: 1,
      login_details: loginDetailsProjection,
    },
  });
  return await clubAcademyInst.aggregate(pipelines);
}

function processBatch(documents) {}

async function handleRecord(doc) {
  let playerName = "";
  if (doc.role == ROLE.PLAYER) {
    let playerDetails = await utilityInst.getPlayerDetails(doc.user_id, {
      first_name: 1,
    });
    if (!playerDetails) {
      return;
    }
    playerName = playerDetails.first_name;
  }
  if ([ROLE.CLUB, ROLE.ACADEMY].includes(doc.role)) {
    let clubAcademyDetails = await utilityInst.getClubDetails(doc.user_id, {
      name: 1,
    });
    if (!clubAcademyDetails) {
      return;
    }
    playerName = clubAcademyDetails.name;
  }

  const payload = {
    email: doc.username,
    name: playerName,
  };

  await emailService.postEmailConfirmation(payload);
}
