'use strict';

const { Router } = require('express');
const cartController = require('./cart.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const Joi = require('joi');
const validate = require('../../middleware/validate.middleware');

const router = Router();

const addItemSchema = Joi.object({
  watch_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

router.use(generalLimiter);
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', validate(addItemSchema), cartController.addItem);
router.put('/items/:itemId', validate(updateItemSchema), cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
