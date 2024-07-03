const Joi = require('joi');

const speechSchema = Joi.object({
  text: Joi.string().min(1).required(),
  voice: Joi.string().valid('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer').required(),
});

module.exports = { speechSchema };