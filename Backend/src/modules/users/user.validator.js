'use strict';

const Joi = require('joi');

const addressSchema = Joi.object({
  street: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  zip: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),
  phone: Joi.string().trim().pattern(/^\+?[1-9]\d{6,14}$/).optional().allow('', null).messages({
    'string.pattern.base': 'Phone number is not valid.',
  }),
  address: addressSchema.optional(),
  avatar_url: Joi.string().uri().optional().allow('', null),
});

module.exports = { updateUserSchema };
