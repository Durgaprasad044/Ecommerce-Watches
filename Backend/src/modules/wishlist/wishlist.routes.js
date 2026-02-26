'use strict';

const { Router } = require('express');
const wishlistController = require('./wishlist.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');

const router = Router();

router.use(generalLimiter);
router.use(authMiddleware);

router.get('/', wishlistController.getWishlist);
router.post('/:watchId', wishlistController.addToWishlist);
router.delete('/:watchId', wishlistController.removeFromWishlist);

module.exports = router;
