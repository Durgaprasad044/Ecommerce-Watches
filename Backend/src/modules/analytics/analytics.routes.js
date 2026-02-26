'use strict';

const { Router } = require('express');
const analyticsController = require('./analytics.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const { USER_ROLES } = require('../../utils/constants');

const router = Router();
router.use(generalLimiter);
router.use(authMiddleware);
router.use(requireRole(USER_ROLES.ADMIN));

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/top-products', analyticsController.getTopProducts);
router.get('/users', analyticsController.getUserAnalytics);
router.get('/revenue', analyticsController.getRevenueReport);

module.exports = router;
