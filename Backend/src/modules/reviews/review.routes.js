'use strict';

const { Router } = require('express');
const reviewController = require('./review.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const { reviewSchema, updateReviewSchema } = require('./review.validator');

const router = Router({ mergeParams: true });

router.use(generalLimiter);

// Public
router.get('/watches/:watchId/reviews', reviewController.getWatchReviews);

// Authenticated
router.post('/watches/:watchId/reviews', authMiddleware, validate(reviewSchema), reviewController.createReview);
router.put('/reviews/:id', authMiddleware, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/reviews/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
