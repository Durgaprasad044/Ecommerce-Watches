'use strict';

const Joi = require('joi');

const createWatchSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  brand: Joi.string().trim().min(1).max(100).required(),
  model: Joi.string().trim().min(1).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  description: Joi.string().trim().min(10).max(5000).required(),
  category: Joi.string().trim().required(),
  sku: Joi.string().trim().uppercase().required(),
  stock_quantity: Joi.number().integer().min(0).required(),
  is_featured: Joi.boolean().optional().default(false),
  specifications: Joi.object().optional().default({}),
  images: Joi.array().items(Joi.string().uri()).optional().default([]),
});

const updateWatchSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).optional(),
  brand: Joi.string().trim().min(1).max(100).optional(),
  model: Joi.string().trim().min(1).max(100).optional(),
  price: Joi.number().positive().precision(2).optional(),
  description: Joi.string().trim().min(10).max(5000).optional(),
  category: Joi.string().trim().optional(),
  sku: Joi.string().trim().uppercase().optional(),
  stock_quantity: Joi.number().integer().min(0).optional(),
  is_featured: Joi.boolean().optional(),
  specifications: Joi.object().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
}).min(1);

const watchQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  brand: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  min_price: Joi.number().min(0).optional(),
  max_price: Joi.number().min(0).optional(),
  sort: Joi.string().valid('price_asc', 'price_desc', 'newest', 'rating').default('newest'),
  featured: Joi.boolean().optional(),
});

const searchQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).required().messages({
    'any.required': 'Search query (q) is required.',
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = { createWatchSchema, updateWatchSchema, watchQuerySchema, searchQuerySchema };
