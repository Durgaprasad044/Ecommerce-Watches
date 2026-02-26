'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const inventoryService = require('./inventory.service');

const getAllInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getAllInventory();
  return sendSuccess(res, inventory, 'Inventory retrieved.');
});

const getLowStockAlerts = asyncHandler(async (req, res) => {
  const alerts = await inventoryService.getLowStockAlerts();
  return sendSuccess(res, alerts, 'Low stock alerts retrieved.');
});

const updateStock = asyncHandler(async (req, res) => {
  const data = await inventoryService.updateStock(req.params.watchId, req.body);
  return sendSuccess(res, data, 'Inventory updated.');
});

const adjustStock = asyncHandler(async (req, res) => {
  const data = await inventoryService.adjustStock(req.params.watchId, req.body);
  return sendSuccess(res, data, 'Stock adjusted.');
});

module.exports = { getAllInventory, getLowStockAlerts, updateStock, adjustStock };
