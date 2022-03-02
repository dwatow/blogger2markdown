const { JSDOM } = require("jsdom");

module.exports = function htmlToDom(html) {
  return new JSDOM(html).window.document;
};
