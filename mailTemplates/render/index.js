const header = require("./partials/header");
const footer = require("./partials/footer");
const config = require("../../config");

const globalData = {
  appName: config.app.name,
  appUrl: config.app.baseURL,
};

module.exports = (html, data = {}) => {
  const payload = {};
  Object.assign(payload, globalData);
  Object.assign(payload, data);

  let renderedHtml = header(payload);

  if (typeof html == "function") {
    renderedHtml += html.call(this, payload);
  } else {
    renderedHtml += html;
  }

  renderedHtml += footer(payload);

  return renderedHtml;
};
