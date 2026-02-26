'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');
const { ORDER_STATUSES, COUPON_TYPES, NOTIFICATION_TYPES } = require('../../utils/constants');
const { PAGINATION_LIMIT } = require('../../config/constants');
const notificationService = require('../notifications/notification.service');

const createOrder = async (userId, { items, shipping_address, payment_method, coupon_code }) => {
  // 1. Validate stock and fetch prices
  const watchIds = items.map((i) => i.watch_id);
  const { data: watches, error: watchError } = await db
    .from('watches')
    .select('id, name, price, inventory(quantity, reserved_quantity)')
    .in('id', watchIds)
    .eq('is_deleted', false);

  if (watchError) throw new AppError('Failed to validate watches.', 500, false);

  const watchMap = Object.fromEntries(watches.map((w) => [w.id, w]));

  for (const item of items) {
    const watch = watchMap[item.watch_id];
    if (!watch) throw new AppError(`Watch not found: ${item.watch_id}`, 404);
    const available = (watch.inventory?.quantity || 0) - (watch.inventory?.reserved_quantity || 0);
    if (available < item.quantity) {
      throw new AppError(`Insufficient stock for "${watch.name}". Available: ${available}.`, 400);
    }
  }

  // 2. Calculate subtotal
  let subtotal = 0;
  const orderItems = items.map((item) => {
    const watch = watchMap[item.watch_id];
    const lineTotal = watch.price * item.quantity;
    subtotal += lineTotal;
    return {
      watch_id: item.watch_id,
      quantity: item.quantity,
      unit_price: watch.price,
      line_total: lineTotal,
    };
  });

  // 3. Apply coupon if provided
  let discount = 0;
  let couponId = null;
  if (coupon_code) {
    const { data: coupon } = await db
      .from('coupons')
      .select('*')
      .eq('code', coupon_code)
      .eq('is_active', true)
      .single();

    if (coupon) {
      const now = new Date();
      if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        throw new AppError('Coupon has expired.', 400);
      }
      if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        throw new AppError('Coupon usage limit reached.', 400);
      }
      if (coupon.minimum_order_value && subtotal < coupon.minimum_order_value) {
        throw new AppError(`Minimum order value for this coupon is ${coupon.minimum_order_value}.`, 400);
      }

      if (coupon.type === COUPON_TYPES.PERCENTAGE) {
        discount = (subtotal * coupon.value) / 100;
      } else if (coupon.type === COUPON_TYPES.FIXED_AMOUNT) {
        discount = Math.min(coupon.value, subtotal);
      }
      couponId = coupon.id;
    }
  }

  const totalAmount = Math.max(0, subtotal - discount);

  // 4. Create order
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      user_id: userId,
      status: ORDER_STATUSES.PENDING,
      subtotal,
      discount,
      total_amount: totalAmount,
      shipping_address,
      payment_method,
      coupon_id: couponId,
    })
    .select()
    .single();

  if (orderError) throw new AppError('Failed to create order.', 500, false);

  // 5. Insert order items
  const { error: itemsError } = await db
    .from('order_items')
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) throw new AppError('Failed to create order items.', 500, false);

  // 6. Deduct inventory
  for (const item of items) {
    await db.rpc('decrement_inventory', {
      p_watch_id: item.watch_id,
      p_quantity: item.quantity,
    });
  }

  // 7. Increment coupon usage
  if (couponId) {
    await db.rpc('increment_coupon_uses', { p_coupon_id: couponId });
  }

  // 8. Send notification
  await notificationService.createNotification({
    user_id: userId,
    type: NOTIFICATION_TYPES.ORDER_PLACED,
    title: 'Order Placed',
    message: `Your order #${order.id.substring(0, 8).toUpperCase()} has been placed successfully.`,
    data: { order_id: order.id },
  });

  return order;
};

const getAllOrders = async ({ page = 1, limit = PAGINATION_LIMIT, userId = null }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = db
    .from('orders')
    .select('*, order_items(*, watches(name, images)), users(name, email)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (userId) query = query.eq('user_id', userId);

  const { data, error, count } = await query.range(from, to);
  if (error) throw new AppError('Failed to fetch orders.', 500, false);
  return { data, total: count, page, limit };
};

const getOrderById = async (id, userId = null) => {
  let query = db
    .from('orders')
    .select('*, order_items(*, watches(name, brand, images)), users(name, email, phone)')
    .eq('id', id);

  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query.single();
  if (error || !data) throw new AppError('Order not found.', 404);
  return data;
};

const updateOrderStatus = async (id, status) => {
  const { data, error } = await db
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status, user_id')
    .single();

  if (error || !data) throw new AppError('Order not found.', 404);

  const notifTypeMap = {
    shipped: NOTIFICATION_TYPES.ORDER_SHIPPED,
    delivered: NOTIFICATION_TYPES.ORDER_DELIVERED,
    cancelled: NOTIFICATION_TYPES.ORDER_CANCELLED,
  };

  if (notifTypeMap[status]) {
    await notificationService.createNotification({
      user_id: data.user_id,
      type: notifTypeMap[status],
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order #${id.substring(0, 8).toUpperCase()} is now ${status}.`,
      data: { order_id: id },
    });
  }

  return data;
};

const cancelOrder = async (id, userId) => {
  const { data: order, error } = await db
    .from('orders')
    .select('id, status, order_items(*)')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !order) throw new AppError('Order not found.', 404);

  const cancellableStatuses = [ORDER_STATUSES.PENDING, ORDER_STATUSES.CONFIRMED];
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError(`Cannot cancel an order in "${order.status}" status.`, 400);
  }

  await db
    .from('orders')
    .update({ status: ORDER_STATUSES.CANCELLED, updated_at: new Date().toISOString() })
    .eq('id', id);

  // Restore inventory
  for (const item of order.order_items) {
    await db.rpc('increment_inventory', {
      p_watch_id: item.watch_id,
      p_quantity: item.quantity,
    });
  }

  return true;
};

const getInvoice = async (id, userId) => {
  const order = await getOrderById(id, userId);
  return order;
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus, cancelOrder, getInvoice };
