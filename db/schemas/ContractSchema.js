const Role = require("../../constants/Role");

module.exports = {
  fields: {
    user_id: {
      type: String,
    },
    playerName: String,
    category: {
      type: String,
      enum: [Role.CLUB, Role.ACADEMY],
    },
    signingDate: Date,
    effectiveDate: Date,
    expiryDate: Date,
    placeOfSignature: Date,
    representativeName: String,
    address: String,
    phoneNumber: String,
    aiffNumber: String,
    crsUserName: String,
    legalGuardianName: String,
    playerAddress: String,
    playerMobileNumber: String,
    playerEmail: String,

    clubUsesAgentServices: Boolean,
    IntermediaryName: String,
    TransferFee: String,

    playerUsesAgentServices: Boolean,


  },
  schemaName: "Contracts",
  options: {
    timestamps: true,
  },
};
