'use strict';

const { Router } = require('express');
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const validate = require('../../middleware/validate.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const { updateUserSchema } = require('./user.validator');
const { USER_ROLES } = require('../../utils/constants');

const router = Router();

router.use(generalLimiter);

// Admin: get all users
router.get('/', authMiddleware, requireRole(USER_ROLES.ADMIN), userController.getAllUsers);

// Self or admin: get/update/delete user
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authMiddleware, requireRole(USER_ROLES.ADMIN), userController.deleteUser);

// Related resources
router.get('/:id/orders', authMiddleware, userController.getUserOrders);
router.get('/:id/wishlist', authMiddleware, userController.getUserWishlist);

module.exports = router;
