const schedule = require("node-schedule");
const updateContractStatus = require("../seeders/EmploymentContractStatus");
const config = require("../config");
const rule = config.scheduler.contract_status_update_schedule;
const contractStatusUpdateScheduler = schedule.scheduleJob(rule, function () {
  updateContractStatus();
});

const documentReminderJob = require("./jobs/document.submission");

if (config.scheduler.document_reminder_schedule_enabled) {
  schedule.scheduleJob(config.scheduler.document_reminder_schedule, () => {
    console.log("Initiated document upload reminder job.");
    documentReminderJob();
  });
}

module.exports = contractStatusUpdateScheduler;
