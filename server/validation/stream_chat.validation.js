const Joi = require('joi');

const chatSchema = Joi.object({
  prompt: Joi.string().min(1).required()
});

module.exports = { chatSchema };