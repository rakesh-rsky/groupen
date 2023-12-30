var moment = require("moment");

var generateMessage = (name, username, text) => {
  return {
    name,
    username,
    text,
    createdAt: moment().valueOf(),
  };
};

var generateLocationMessage = (name, username, latitude, longitude) => {
  return {
    name,
    username,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf(),
  };
};

module.exports = { generateMessage, generateLocationMessage };
