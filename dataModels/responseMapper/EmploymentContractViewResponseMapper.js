class EmploymentContractViewResponseMapper {
  map(data) {
    return {
      club_academy_uses_agent_services: data.club_academy_uses_agent_services,
      player_uses_agent_services: data.player_uses_agent_services,
      is_deleted: data.is_deleted,
      player_name: data.player_name,
      club_academy_name: data.club_academy_name,
      signing_date: data.signing_date,
      effective_date: data.effective_date,
      expiry_date: data.expiry_date,
      place_of_signature: data.place_of_signature,
      player_mobile_number: data.player_mobile_number,
      club_academy_representative_name: data.club_academy_representative_name,
      club_academy_address: data.club_academy_address,
      club_academy_phone_number: data.club_academy_phone_number,
      club_academy_email: data.club_academy_email,
      aiff_number: data.aiff_number,
      crs_user_name: data.crs_user_name,
      legal_guardian_name: data.legal_guardian_name,
      player_address: data.player_address,
      player_email: data.player_email,
      club_academy_intermediary_name: data.club_academy_intermediary_name,
      club_academy_transfer_fee: data.club_academy_transfer_fee,
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
