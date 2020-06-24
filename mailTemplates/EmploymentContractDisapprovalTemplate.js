module.exports = ({ email, name, reason }) => {
    return {
      to: email,
      subject: "Contract Disapproved",
      // html: "",
      text: `Employment Contract for ${name} has been disapproved due to ${reason} reason, Please update again.`,
    };
  };