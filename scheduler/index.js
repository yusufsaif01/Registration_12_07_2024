const schedule = require("node-schedule");
const updateContractStatus = require("../seeders/EmploymentContractStatus");
const updatePlayerType = require("../seeders/playerTypeUpdate");
const documentReminderJob = require("./jobs/document.submission");
const config = require("../config");

const contractRule = config.scheduler.contract_status_update_schedule;
const playerRule = config.scheduler.player_type_update_schedule;
const contractStatusUpdateScheduler = schedule.scheduleJob(
  contractRule,
  function () {
    updateContractStatus();
  }
);
const playerTypeUpdateScheduler = schedule.scheduleJob(playerRule, function () {
  updatePlayerType();
});

if (config.scheduler.document_reminder_schedule_enabled) {
  schedule.scheduleJob(config.scheduler.document_reminder_schedule, () => {
    console.log("Initiated document upload reminder job.");
    documentReminderJob();
  });
}

module.exports = { contractStatusUpdateScheduler, playerTypeUpdateScheduler };
