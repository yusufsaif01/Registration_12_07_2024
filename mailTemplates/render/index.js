const header = require("./partials/header");
const footer = require("./partials/footer");
const config = require("../../config");

const globalData = {
  appName: config.app.name,
  appUrl: config.app.baseURL,
  socialLinks: {
    facebook: config.app.facebook_url,
    instagram: config.app.instagram_url,
    linkedin: config.app.linkedin_url,
    twitter: config.app.twitter_url,
  },
  footerLinks: {
    privacyPolicy: config.app.baseURL,
    termsConditions: config.app.baseURL,
    contactUs: config.app.baseURL,
  },
  contactUsEmail: config.app.contact_us_email,
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
