'use strict';

const Joi = require('joi');

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.min': 'Rating must be between 1 and 5.',
    'number.max': 'Rating must be between 1 and 5.',
    'any.required': 'Rating is required.',
  }),
  title: Joi.string().trim().max(200).optional().allow('', null),
  body: Joi.string().trim().min(10).max(2000).required().messages({
    'string.min': 'Review body must be at least 10 characters.',
    'any.required': 'Review body is required.',
  }),
  images: Joi.array().items(Joi.string().uri()).max(5).optional().default([]),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  title: Joi.string().trim().max(200).optional().allow('', null),
  body: Joi.string().trim().min(10).max(2000).optional(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional(),
}).min(1);

module.exports = { reviewSchema, updateReviewSchema };
