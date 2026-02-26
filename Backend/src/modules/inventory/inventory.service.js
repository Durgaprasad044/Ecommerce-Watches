'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');
const { INVENTORY_LOG_TYPES } = require('../../utils/constants');
const notificationService = require('../notifications/notification.service');
const { NOTIFICATION_TYPES } = require('../../utils/constants');

const getAllInventory = async () => {
  const { data, error } = await db
    .from('inventory')
    .select('*, watches(id, name, brand, sku)')
    .order('quantity', { ascending: true });
  if (error) throw new AppError('Failed to fetch inventory.', 500, false);
  return data;
};

const getLowStockAlerts = async () => {
  const { data, error } = await db
    .from('inventory')
    .select('*, watches(id, name, brand, sku)')
    .filter('quantity', 'lte', db.raw('low_stock_threshold'));
  if (error) throw new AppError('Failed to fetch low stock alerts.', 500, false);
  return data;
};

const updateStock = async (watchId, { quantity, low_stock_threshold }) => {
  const updates = {};
  if (quantity !== undefined) updates.quantity = quantity;
  if (low_stock_threshold !== undefined) updates.low_stock_threshold = low_stock_threshold;

  const { data, error } = await db
    .from('inventory')
    .update(updates)
    .eq('watch_id', watchId)
    .select('*, watches(name)')
    .single();

  if (error || !data) throw new AppError('Inventory record not found.', 404);

  // Check for low stock
  if (data.quantity <= data.low_stock_threshold) {
    await notificationService.createNotification({
      type: NOTIFICATION_TYPES.LOW_STOCK,
      title: 'Low Stock Alert',
      message: `"${data.watches?.name}" stock is low: ${data.quantity} units remaining.`,
      data: { watch_id: watchId },
      is_admin: true,
    });
  }

  return data;
};

const adjustStock = async (watchId, { adjustment, reason }) => {
  const { data: inventory, error } = await db
    .from('inventory')
    .select('id, quantity')
    .eq('watch_id', watchId)
    .single();

  if (error || !inventory) throw new AppError('Inventory record not found.', 404);

  const newQuantity = inventory.quantity + adjustment;
  if (newQuantity < 0) throw new AppError('Cannot reduce stock below zero.', 400);

  const { data, error: updateError } = await db
    .from('inventory')
    .update({ quantity: newQuantity })
    .eq('watch_id', watchId)
    .select()
    .single();

  if (updateError) throw new AppError('Failed to adjust stock.', 500, false);

  // Log to inventory_logs
  await db.from('inventory_logs').insert({
    watch_id: watchId,
    adjustment,
    reason: reason || INVENTORY_LOG_TYPES.ADJUSTMENT,
    quantity_before: inventory.quantity,
    quantity_after: newQuantity,
  });

  return data;
};

module.exports = { getAllInventory, getLowStockAlerts, updateStock, adjustStock };
