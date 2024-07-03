const winston = require('winston');

const checkRequiredEnvironmentVariables = () => {
  const requiredVariables = ['PORT', 'NODE_ENV'];
  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is missing`);
    }
  });
};

const createWinstonOptions = () => {
  return {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  };
};

module.exports = {
  checkRequiredEnvironmentVariables,
  createWinstonOptions,
};