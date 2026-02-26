'use strict';

const Joi = require('joi');
const { PAYMENT_METHODS } = require('../../utils/constants');

const orderItemSchema = Joi.object({
  watch_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const shippingAddressSchema = Joi.object({
  street: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  zip: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  full_name: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
});

const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    'array.min': 'Order must contain at least one item.',
    'any.required': 'Order items are required.',
  }),
  shipping_address: shippingAddressSchema.required(),
  payment_method: Joi.string()
    .valid(...Object.values(PAYMENT_METHODS))
    .required(),
  coupon_code: Joi.string().trim().uppercase().optional().allow('', null),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
    .required(),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
