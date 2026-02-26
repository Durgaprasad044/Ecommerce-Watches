'use strict';

const { Router } = require('express');
const couponController = require('./coupon.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const Joi = require('joi');
const validate = require('../../middleware/validate.middleware');
const { COUPON_TYPES, USER_ROLES } = require('../../utils/constants');

const couponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(20).required(),
  type: Joi.string().valid(...Object.values(COUPON_TYPES)).required(),
  value: Joi.number().positive().required(),
  max_discount: Joi.number().positive().optional(),
  minimum_order_value: Joi.number().min(0).optional(),
  max_uses: Joi.number().integer().positive().optional(),
  uses_per_user: Joi.number().integer().positive().optional(),
  expires_at: Joi.string().isoDate().optional(),
  is_active: Joi.boolean().default(true),
});

const validateSchema = Joi.object({
  code: Joi.string().trim().required(),
  order_total: Joi.number().min(0).required(),
});

const router = Router();
router.use(generalLimiter);

// Admin routes
router.post('/', authMiddleware, requireRole(USER_ROLES.ADMIN), validate(couponSchema), couponController.createCoupon);
router.get('/', authMiddleware, requireRole(USER_ROLES.ADMIN), couponController.getAllCoupons);
router.put('/:id', authMiddleware, requireRole(USER_ROLES.ADMIN), couponController.updateCoupon);
router.delete('/:id', authMiddleware, requireRole(USER_ROLES.ADMIN), couponController.deleteCoupon);

// Public (but need auth to check per-user limit)
router.post('/validate', authMiddleware, validate(validateSchema), couponController.validateCoupon);

module.exports = router;
