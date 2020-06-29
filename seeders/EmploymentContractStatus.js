const EmploymentContractService = require('../services/EmploymentContractService');
const CONTRACT_STATUS = require("../constants/ContractStatus");

var updateContractStatus = () => {
    (async () => {
        try {
            const serviceInst = new EmploymentContractService();
            let condition = { $or: [{ status: CONTRACT_STATUS.ACTIVE }, { status: CONTRACT_STATUS.YET_TO_START }], is_deleted: false };
            let contracts = await serviceInst.contractInst.find(condition, { effectiveDate: 1, expiryDate: 1, id: 1, _id: 0 });
            for (const contract of contracts) {
                let status = serviceInst.getEmploymentContractStatus(contract);
                await serviceInst.contractInst.updateOne({ id: contract.id }, { status: status });
            }
            console.log("*****contract-status-updated*****");
        } catch (err) {
            console.log("*****contract-status-update-error*****", err);
        }
    })();
}

module.exports =  updateContractStatus
