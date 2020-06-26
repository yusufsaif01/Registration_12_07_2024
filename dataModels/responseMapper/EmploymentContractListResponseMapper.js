
class EmploymentContractListResponseMapper {
    map(contracts) {
        let response = [];
        if (contracts.length) {
            contracts.forEach((contract) => {
                let data = {
                    id: contract.id,
                    effectiveDate: contract.effectiveDate,
                    expiryDate: contract.expiryDate,
                    status: contract.status,
                    name: contract.name,
                    clubAcademyUserId: contract.clubAcademyUserId || "",
                    avatar: contract.avatar || "",
                    created_by: contract.created_by,
                    canUpdateStatus: contract.canUpdateStatus
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = EmploymentContractListResponseMapper;