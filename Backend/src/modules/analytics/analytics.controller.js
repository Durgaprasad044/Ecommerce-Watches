'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const analyticsService = require('./analytics.service');

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  return sendSuccess(res, stats, 'Dashboard stats retrieved.');
});

const getSalesAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSalesAnalytics(req.query);
  return sendSuccess(res, data, 'Sales analytics retrieved.');
});

const getTopProducts = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopProducts({ limit: parseInt(req.query.limit, 10) || 10 });
  return sendSuccess(res, data, 'Top products retrieved.');
});

const getUserAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getUserAnalytics(req.query);
  return sendSuccess(res, data, 'User analytics retrieved.');
});

const getRevenueReport = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenueReport(req.query);
  return sendSuccess(res, data, 'Revenue report retrieved.');
});

module.exports = { getDashboardStats, getSalesAnalytics, getTopProducts, getUserAnalytics, getRevenueReport };
