'use strict';

const { Router } = require('express');
const orderController = require('./order.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const validate = require('../../middleware/validate.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const { createOrderSchema, updateOrderStatusSchema } = require('./order.validator');
const { USER_ROLES } = require('../../utils/constants');

const router = Router();

router.use(generalLimiter);
router.use(authMiddleware);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', requireRole(USER_ROLES.ADMIN), validate(updateOrderStatusSchema), orderController.updateOrderStatus);
router.post('/:id/cancel', orderController.cancelOrder);
router.get('/:id/invoice', orderController.getInvoice);

module.exports = router;
