const Joi = require('joi');
const roles = require('../data/roles.attribute.json');
const prompts = require('../data/message.prompts.json');

const categoryChatSchema = Joi.object({
  role: Joi.string().valid(...roles.starter_prompts_including_roles).required(),
  category: Joi.string().valid(...Object.keys(prompts.prompts)).required()
});

module.exports = { categoryChatSchema };