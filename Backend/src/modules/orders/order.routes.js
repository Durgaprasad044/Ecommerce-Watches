'use strict';

const { Router } = require('express');
const orderController = require('./order.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const validate = require('../../middleware/validate.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const { createOrderSchema, updateOrderStatusSchema, verifyPaymentSchema, updateTrackingSchema } = require('./order.validator');
const { USER_ROLES } = require('../../utils/constants');

const router = Router();

router.use(generalLimiter);
router.use(authMiddleware);

// Order CRUD
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);

// Payment verification (after Razorpay popup success)
router.post('/:id/verify-payment', validate(verifyPaymentSchema), orderController.verifyPayment);

// Tracking
router.get('/:id/tracking', orderController.getTracking);
router.put('/:id/tracking', requireRole(USER_ROLES.ADMIN), validate(updateTrackingSchema), orderController.updateTrackingStatus);

// Order status (admin)
router.put('/:id/status', requireRole(USER_ROLES.ADMIN), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

// User actions
router.post('/:id/cancel', orderController.cancelOrder);
router.get('/:id/invoice', orderController.getInvoice);

module.exports = router;
