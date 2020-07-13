
class EmploymentContractListResponseMapper {
    map(contracts) {
        let response = [];
        if (contracts.length) {
            contracts.forEach((contract) => {
                let data = {
                    id: contract.id,
                    effective_date: contract.effective_date,
                    expiry_date: contract.expiry_date,
                    status: contract.status,
                    name: contract.name,
                    club_academy_user_id: contract.clubAcademyUserId || "",
                    avatar: contract.avatar || "",
                    created_by: contract.created_by,
                    can_update_status: contract.canUpdateStatus
                };
                response.push(data);
            });
        }
        return response;
    }
}

module.exports = EmploymentContractListResponseMapper;