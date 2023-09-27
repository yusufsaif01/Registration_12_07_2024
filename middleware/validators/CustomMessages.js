module.exports = (messages = {}, defaultMessage) => {
  return function (errors) {
    if (errors.length) {
      const errorType = errors[0].type;
      if (messages[errorType]) {
        return messages[errorType];
      }
      return defaultMessage;
    }
  };
};
