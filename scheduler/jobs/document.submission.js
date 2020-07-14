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

const loginInst = new LoginUtility();
const utilityInst = new UtilityService();
const emailService = new EmailService();

module.exports = async () => {
  loginInst
    .cursor(
      {
        status: ACCOUNT_STATUS.ACTIVE,
        "profile_status.status": PROFILE_STATUS.NON_VERIFIED,
        is_deleted: false,
      },
      {
        username: 1,
        user_id: 1,
        role: 1,
      }
    )
    .then((resolved) => {
      const batchSize = config.scheduler.document_reminder_batch_size;
      const timeOut = config.scheduler.document_reminder_timeout;
      console.log(
        `Batch Size : ${batchSize} records, with timeout of ${timeOut} ms.`
      );
      (async function iterateRecords() {
        for (let i = 0; i < batchSize; i++) {
          let doc = await resolved.next();
          if (!doc) {
            return;
          }
          await handleRecord(doc);
        }
        setTimeout(iterateRecords, timeOut);
      })();
    });
};

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
