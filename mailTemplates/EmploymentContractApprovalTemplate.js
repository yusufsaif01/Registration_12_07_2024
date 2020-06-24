module.exports = ({ email, name }) => {
    return {
      to: email,
      subject: "Contract Approved",
      // html: "",
      text: `Employment Contract for ${name} has been approved successfully.`,
    };
  };