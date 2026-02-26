'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const cartService = require('./cart.service');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return sendSuccess(res, cart, 'Cart retrieved.');
});

const addItem = asyncHandler(async (req, res) => {
  const item = await cartService.addItem(req.user.id, req.body);
  return sendSuccess(res, item, 'Item added to cart.', 201);
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await cartService.updateItem(req.user.id, req.params.itemId, req.body);
  return sendSuccess(res, item, 'Cart item updated.');
});

const removeItem = asyncHandler(async (req, res) => {
  await cartService.removeItem(req.user.id, req.params.itemId);
  return sendSuccess(res, null, 'Item removed from cart.');
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);
  return sendSuccess(res, null, 'Cart cleared.');
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
