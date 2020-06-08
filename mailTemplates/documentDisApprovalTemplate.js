module.exports = ({ email, documentType, name, memberType, reason }) => {
  return {
    to: email,
    subject: "Your document details is disapproved",
    // html: "",
    text: `${documentType} document details for ${name} has been disapproved by YFTChain due to "${reason}", please update again.`,
  };
};