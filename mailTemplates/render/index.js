const header = require("./partials/header");
const footer = require("./partials/footer");
const config = require("../../config");

const globalData = {
  appName: config.app.name,
  appUrl: config.app.baseURL,
};

module.exports = (html, data = {}) => {
  data = Object.assign(globalData, data);
  let renderedHtml = header(data);

  if (typeof html == "function") {
    renderedHtml += html.call(this, data);
  } else {
    renderedHtml += html;
  }

  renderedHtml += footer(data);

  return renderedHtml;
};
