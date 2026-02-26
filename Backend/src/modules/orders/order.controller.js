'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../../utils/response');
const orderService = require('./order.service');
const { USER_ROLES } = require('../../utils/constants');

const createOrder = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder(req.user.id, req.body);
  return sendSuccess(res, result, 'Order created. Complete payment to confirm.', 201);
});

const verifyPayment = asyncHandler(async (req, res) => {
  const order = await orderService.verifyPayment(req.params.id, req.body);
  return sendSuccess(res, order, 'Payment verified. Order confirmed.');
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user.role === USER_ROLES.ADMIN ? null : req.user.id;
  const result = await orderService.getAllOrders({ page: +page, limit: +limit, userId });
  return sendPaginated(res, result.data, result, 'Orders retrieved successfully.');
});

const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.role === USER_ROLES.ADMIN ? null : req.user.id;
  const order = await orderService.getOrderById(req.params.id, userId);
  return sendSuccess(res, order, 'Order retrieved successfully.');
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  return sendSuccess(res, order, 'Order status updated.');
});

const updateTrackingStatus = asyncHandler(async (req, res) => {
  const data = await orderService.updateTrackingStatus(req.params.id, req.body.tracking_status);
  return sendSuccess(res, data, 'Tracking status updated.');
});

const getTracking = asyncHandler(async (req, res) => {
  const userId = req.user.role === USER_ROLES.ADMIN ? null : req.user.id;
  const data = await orderService.getTracking(req.params.id, userId);
  return sendSuccess(res, data, 'Tracking info retrieved.');
});

const cancelOrder = asyncHandler(async (req, res) => {
  await orderService.cancelOrder(req.params.id, req.user.id);
  return sendSuccess(res, null, 'Order cancelled successfully.');
});

const getInvoice = asyncHandler(async (req, res) => {
  const userId = req.user.role === USER_ROLES.ADMIN ? null : req.user.id;
  const invoice = await orderService.getInvoice(req.params.id, userId);
  return sendSuccess(res, invoice, 'Invoice retrieved.');
});

module.exports = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTrackingStatus,
  getTracking,
  cancelOrder,
  getInvoice,
};
