'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const wishlistService = require('./wishlist.service');

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  return sendSuccess(res, wishlist, 'Wishlist retrieved.');
});

const addToWishlist = asyncHandler(async (req, res) => {
  const result = await wishlistService.toggleWishlist(req.user.id, req.params.watchId);
  const message = result.action === 'added' ? 'Added to wishlist.' : 'Removed from wishlist.';
  return sendSuccess(res, result, message);
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  await wishlistService.removeFromWishlist(req.user.id, req.params.watchId);
  return sendSuccess(res, null, 'Removed from wishlist.');
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
