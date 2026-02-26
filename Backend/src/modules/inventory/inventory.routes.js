'use strict';

const { Router } = require('express');
const inventoryController = require('./inventory.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const Joi = require('joi');
const validate = require('../../middleware/validate.middleware');
const { USER_ROLES } = require('../../utils/constants');

const updateStockSchema = Joi.object({
  quantity: Joi.number().integer().min(0).optional(),
  low_stock_threshold: Joi.number().integer().min(0).optional(),
}).min(1);

const adjustStockSchema = Joi.object({
  adjustment: Joi.number().integer().not(0).required().messages({
    'any.invalid': 'Adjustment cannot be zero.',
  }),
  reason: Joi.string().trim().optional(),
});

const router = Router();
router.use(generalLimiter);
router.use(authMiddleware);
router.use(requireRole(USER_ROLES.ADMIN));

router.get('/', inventoryController.getAllInventory);
router.get('/low-stock', inventoryController.getLowStockAlerts);
router.put('/:watchId', validate(updateStockSchema), inventoryController.updateStock);
router.post('/:watchId/adjust', validate(adjustStockSchema), inventoryController.adjustStock);

module.exports = router;
