module.exports = ({ email, name }) => {
  return {
    to: email,
    subject: "Sample Html template",
    // can support simple string as well, however data variable will not be accessible.
    html(data) {
      return `
        <h1>This is a sample html template, Name = ${data.name}, visit ${data.appUrl} for more info.</h1>
      `;
    },
    // will use text template if html field is not present.
    text: `A Contract has been added for you by ${name}.`,
  };
};
