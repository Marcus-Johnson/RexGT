const winston = require('winston');

function checkRequiredEnvironmentVariables() {
  const requiredVariables = ['OPENAI_KEY', 'PORT'];
  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Environment Variable Missing: ${variable}`);
    }
  });
}

function createWinstonOptions() {
  return {
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
  };
}

module.exports = {
  checkRequiredEnvironmentVariables,
  createWinstonOptions,
};