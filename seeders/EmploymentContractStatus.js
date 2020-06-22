const db = require('../db');
const EmploymentContractService = require('../services/EmploymentContractService');
const CONTRACT_STATUS = require("../constants/ContractStatus");
const path = require('path');
let baseDir = path.resolve(__dirname);
global.__basedir = baseDir.split('\seeders')[0];

var updateContractStatus = () => {
    (async () => {
        try {
            await db.connectDB();
            const serviceInst = new EmploymentContractService();
            let condition = { $or: [{ status: CONTRACT_STATUS.ACTIVE }, { status: CONTRACT_STATUS.YET_TO_START }], is_deleted: false };
            let contracts = await serviceInst.employmentContractUtilityInst.find(condition, { effectiveDate: 1, expiryDate: 1, id: 1, _id: 0 });
            for (const contract of contracts) {
                let status = serviceInst.getEmploymentContractStatus(contract);
                await serviceInst.employmentContractUtilityInst.updateOne({ id: contract.id }, { status: status });
            }
            console.log("#############DONE##############");
            process.exit();
        } catch (err) {
            console.log("#############ERROR##############", err);
            process.exit(err);
        }
    })();
}

updateContractStatus();

