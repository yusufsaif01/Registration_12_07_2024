const schedule = require('node-schedule');
const updateContractStatus = require('../seeders/EmploymentContractStatus');
const updatePlayerType = require('../seeders/playerTypeUpdate');
const config = require("../config");
const contractRule = config.scheduler.contract_status_update_schedule
const playerRule = config.scheduler.player_type_update_schedule
const contractStatusUpdateScheduler = schedule.scheduleJob(contractRule, function () {
    updateContractStatus();
});
const playerTypeUpdateScheduler = schedule.scheduleJob(playerRule, function () {
    updatePlayerType();
});
module.exports = { contractStatusUpdateScheduler, playerTypeUpdateScheduler };