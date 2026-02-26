'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../../utils/response');
const reviewService = require('./review.service');
const validate = require('../../middleware/validate.middleware');
const { reviewSchema, updateReviewSchema } = require('./review.validator');

const getWatchReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await reviewService.getWatchReviews(req.params.watchId, { page: +page, limit: +limit });
  return sendPaginated(res, result.data, result, 'Reviews retrieved.');
});

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.params.watchId, req.body);
  return sendSuccess(res, review, 'Review submitted.', 201);
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.user.id, req.body);
  return sendSuccess(res, review, 'Review updated.');
});

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user.id);
  return sendSuccess(res, null, 'Review deleted.');
});

module.exports = { getWatchReviews, createReview, updateReview, deleteReview };
