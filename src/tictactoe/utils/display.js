const ERROR_MSG_COLOR = 31; // Red

const wrapErrorMsg = (msg) =>
  `\x1b[${ERROR_MSG_COLOR}m${msg}\x1b[0m`;

const display = (msg, err=false) =>
  console.log(`${err ? wrapErrorMsg(msg) : msg}\n`);

module.exports = display;
