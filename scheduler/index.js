const schedule = require('node-schedule');
const updateContractStatus = require('../seeders/EmploymentContractStatus');
const config = require("../config");
const rule = config.scheduler.contract_status_update_schedule
const contractStatusUpdateScheduler = schedule.scheduleJob(rule, function () {
    updateContractStatus();
});
module.exports = contractStatusUpdateScheduler;