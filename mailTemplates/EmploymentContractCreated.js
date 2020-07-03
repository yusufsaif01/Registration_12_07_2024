module.exports = ({ email, name }) => {
  return {
    to: email,
    subject: "Employment Contract Created",
    // html: "",
    text: `A Contract has been added for you by ${name}.`,
  };
};