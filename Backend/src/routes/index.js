'use strict';

const { Router } = require('express');
const { sendSuccess } = require('../utils/response');

// Module routers
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const watchRoutes = require('../modules/watches/watch.routes');
const orderRoutes = require('../modules/orders/order.routes');
const cartRoutes = require('../modules/cart/cart.routes');
const wishlistRoutes = require('../modules/wishlist/wishlist.routes');
const reviewRoutes = require('../modules/reviews/review.routes');
const couponRoutes = require('../modules/coupons/coupon.routes');
const referralRoutes = require('../modules/referrals/referral.routes');
const inventoryRoutes = require('../modules/inventory/inventory.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const notificationRoutes = require('../modules/notifications/notification.routes');

const router = Router();

// Health check
router.get('/health', (req, res) => {
  return sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() }, 'WatchVault API is running.');
});

// Mount module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/watches', watchRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/', reviewRoutes);          // Review routes already include /watches/:watchId/reviews prefixes
router.use('/coupons', couponRoutes);
router.use('/referrals', referralRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
