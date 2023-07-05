const Joi = require('joi');

const imageSchema = Joi.object({
  prompt: Joi.string().required(),
  n: Joi.number().integer().positive().required(),
  size: Joi.string().pattern(new RegExp('^[0-9]+x[0-9]+$')).required()
});

module.exports = {
  imageSchema
};