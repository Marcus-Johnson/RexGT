const Joi = require('joi');

const speechSchema = Joi.object({
  text: Joi.string().min(1).required()
});

module.exports = { speechSchema };