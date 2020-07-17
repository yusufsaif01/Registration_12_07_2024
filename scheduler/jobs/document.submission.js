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
const { map } = require("bluebird");

const playerInst = new PlayerUtility();
const clubAcademyInst = new ClubAcademyUtility();
const utilityInst = new UtilityService();
const emailService = new EmailService();

const mapOptions = {
  concurrency: config.scheduler.document_reminder_batch_size,
};

module.exports = async () => {
  try {
    await map(await getPlayers(), (player) => handleRecord(player), mapOptions);
    await map(
      await getClubAcademy(),
      (clubAcademy) => handleRecord(clubAcademy),
      mapOptions
    );
  } catch (error) {
    console.log('Error in executing cron : document reminder', error);
  }
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
      $match: {
        login_details: {
          $elemMatch: {
            status: ACCOUNT_STATUS.ACTIVE,
            "profile_status.status": PROFILE_STATUS.NON_VERIFIED,
          },
        },
      },
    },
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

async function handleRecord(doc) {
  try {
    let playerName = "";
    if (doc.login_details[0].role == ROLE.PLAYER) {
      playerName = doc.first_name;
    }

    if ([ROLE.CLUB, ROLE.ACADEMY].includes(doc.login_details[0].role)) {
      playerName = doc.name;
    }

    const payload = {
      email: doc.login_details[0].username,
      name: playerName,
    };

    await emailService.postEmailConfirmation(payload);
  } catch (error) {
    console.log('Error in handling record ', error);
  }
}
