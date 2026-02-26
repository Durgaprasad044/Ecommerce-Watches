'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../../utils/response');
const userService = require('./user.service');

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await userService.getAllUsers({ page: +page, limit: +limit });
  return sendPaginated(res, result.data, result, 'Users retrieved successfully.');
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, user, 'User retrieved successfully.');
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return sendSuccess(res, user, 'User updated successfully.');
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return sendSuccess(res, null, 'User deleted successfully.');
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await userService.getUserOrders(req.params.id);
  return sendSuccess(res, orders, 'User orders retrieved.');
});

const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlist = await userService.getUserWishlist(req.params.id);
  return sendSuccess(res, wishlist, 'User wishlist retrieved.');
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getUserOrders, getUserWishlist };
