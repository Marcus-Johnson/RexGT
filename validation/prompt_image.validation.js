const Joi = require('joi');

const imageSchema = Joi.object({
  prompt: Joi.string().required(),
});

module.exports = { imageSchema };