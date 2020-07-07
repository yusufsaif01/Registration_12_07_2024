class EmploymentContractViewResponseMapper {
  map(data) {
    return {
      club_academy_uses_agent_services: data.clubAcademyUsesAgentServices,
      player_uses_agent_services: data.playerUsesAgentServices,
      is_deleted: data.is_deleted,
      player_name: data.playerName,
      club_academy_name: data.clubAcademyName,
      signing_date: data.signingDate,
      effective_date: data.effectiveDate,
      expiry_date: data.expiryDate,
      place_of_signature: data.placeOfSignature,
      player_mobile_number: data.playerMobileNumber,
      club_academy_representative_name: data.clubAcademyRepresentativeName,
      club_academy_address: data.clubAcademyAddress,
      club_academy_phone_number: data.clubAcademyPhoneNumber,
      club_academy_email: data.clubAcademyEmail,
      aiff_number: data.aiffNumber,
      crs_user_name: data.crsUserName,
      legal_guardian_name: data.legalGuardianName,
      player_address: data.playerAddress,
      player_email: data.playerEmail,
      club_academy_intermediary_name: data.clubAcademyIntermediaryName,
      club_academy_transfer_fee: data.clubAcademyTransferFee,
      status: data.status,
      sent_by: data.sent_by,
      send_to: data.send_to,
      id: data.id,
      created_by: data.created_by,
      send_to_category: data.send_to_category,
    };
  }
}

module.exports = EmploymentContractViewResponseMapper;
