'use strict';

const crypto = require('crypto');
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  console.warn('⚠️  razorpay package not installed. Run: npm install razorpay');
}
const db = require('../../config/db');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');
const { ORDER_STATUSES, COUPON_TYPES, NOTIFICATION_TYPES, PAYMENT_STATUSES, TRACKING_STATUSES } = require('../../utils/constants');
const { PAGINATION_LIMIT } = require('../../config/constants');
const notificationService = require('../notifications/notification.service');

// Initialize Razorpay instance (lazy — only if package exists)
let razorpay = null;
const getRazorpay = () => {
  if (razorpay) return razorpay;
  if (!Razorpay) throw new AppError('Razorpay SDK not installed. Run: npm install razorpay', 500);
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new AppError('Razorpay credentials not configured in .env', 500);
  }
  razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
  return razorpay;
};

/**
 * Generate a human-readable tracking ID.
 * Format: WV-XXXXXXXX (8 uppercase alphanumeric chars)
 */
const generateTrackingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'WV-';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// ─── CREATE ORDER (Step 1: validate + create + get Razorpay order) ──────────

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

  // 4. Create order in DB (status: pending, payment: pending)
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      user_id: userId,
      status: ORDER_STATUSES.PENDING,
      payment_status: PAYMENT_STATUSES.PENDING,
      subtotal,
      discount,
      total_amount: totalAmount,
      shipping_address,
      payment_method,
      coupon_id: couponId,
      tracking_status: TRACKING_STATUSES.PLACED,
    })
    .select()
    .single();

  if (orderError) throw new AppError('Failed to create order.', 500, false);

  // 5. Insert order items
  const { error: itemsError } = await db
    .from('order_items')
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) throw new AppError('Failed to create order items.', 500, false);

  // 6. If payment method is Razorpay, create Razorpay order
  let razorpayOrder = null;
  if (payment_method === 'razorpay') {
    try {
      razorpayOrder = await getRazorpay().orders.create({
        amount: Math.round(totalAmount * 100), // Razorpay expects paise (INR) or smallest currency unit
        currency: 'INR',
        receipt: order.id,
        notes: {
          order_id: order.id,
          user_id: userId,
        },
      });

      // Store razorpay_order_id in the order
      await db
        .from('orders')
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq('id', order.id);
    } catch (err) {
      throw new AppError('Failed to create Razorpay order.', 500, false);
    }
  } else if (payment_method === 'cod') {
    // COD: confirm immediately, deduct inventory, generate tracking
    const trackingId = generateTrackingId();
    await db
      .from('orders')
      .update({
        status: ORDER_STATUSES.CONFIRMED,
        payment_status: PAYMENT_STATUSES.PENDING,
        tracking_id: trackingId,
        tracking_status: TRACKING_STATUSES.PLACED,
      })
      .eq('id', order.id);

    // Deduct inventory for COD
    for (const item of items) {
      await db.rpc('decrement_inventory', { p_watch_id: item.watch_id, p_quantity: item.quantity });
    }

    if (couponId) {
      await db.rpc('increment_coupon_uses', { p_coupon_id: couponId });
    }

    await notificationService.createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.ORDER_PLACED,
      title: 'Order Placed',
      message: `Your order #${order.id.substring(0, 8).toUpperCase()} has been placed (COD). Tracking: ${trackingId}`,
      data: { order_id: order.id },
    });

    return { ...order, tracking_id: trackingId };
  }

  // Return order + Razorpay details for frontend
  return {
    order_id: order.id,
    amount: totalAmount,
    currency: 'INR',
    razorpay_order_id: razorpayOrder?.id || null,
    razorpay_key_id: env.RAZORPAY_KEY_ID,
  };
};

// ─── VERIFY PAYMENT (Step 2: after Razorpay popup success) ──────────────────

const verifyPayment = async (orderId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  // 1. Fetch order
  const { data: order, error } = await db
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error || !order) throw new AppError('Order not found.', 404);
  if (order.payment_status === PAYMENT_STATUSES.PAID) {
    throw new AppError('Payment already verified.', 400);
  }

  // 2. Verify signature using HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    // Mark payment as failed
    await db.from('orders').update({ payment_status: PAYMENT_STATUSES.FAILED }).eq('id', orderId);
    throw new AppError('Payment verification failed. Invalid signature.', 400);
  }

  // 3. Payment verified — update order
  const trackingId = generateTrackingId();
  const { data: updatedOrder, error: updateError } = await db
    .from('orders')
    .update({
      status: ORDER_STATUSES.CONFIRMED,
      payment_status: PAYMENT_STATUSES.PAID,
      razorpay_payment_id,
      razorpay_signature,
      tracking_id: trackingId,
      tracking_status: TRACKING_STATUSES.PLACED,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (updateError) throw new AppError('Failed to confirm order.', 500, false);

  // 4. Deduct inventory (only after successful payment)
  for (const item of order.order_items) {
    await db.rpc('decrement_inventory', { p_watch_id: item.watch_id, p_quantity: item.quantity });
  }

  // 5. Increment coupon usage
  if (order.coupon_id) {
    await db.rpc('increment_coupon_uses', { p_coupon_id: order.coupon_id });
  }

  // 6. Send notification
  await notificationService.createNotification({
    user_id: order.user_id,
    type: NOTIFICATION_TYPES.ORDER_PLACED,
    title: 'Order Confirmed',
    message: `Payment received! Order #${orderId.substring(0, 8).toUpperCase()} confirmed. Tracking: ${trackingId}`,
    data: { order_id: orderId, tracking_id: trackingId },
  });

  return updatedOrder;
};

// ─── GET ALL ORDERS ─────────────────────────────────────────────────────────

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

// ─── GET ORDER BY ID ────────────────────────────────────────────────────────

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

// ─── UPDATE ORDER STATUS (admin) ────────────────────────────────────────────

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

// ─── UPDATE TRACKING STATUS (admin) ─────────────────────────────────────────

const updateTrackingStatus = async (id, tracking_status) => {
  const { data, error } = await db
    .from('orders')
    .update({ tracking_status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, tracking_id, tracking_status, user_id')
    .single();

  if (error || !data) throw new AppError('Order not found.', 404);

  await notificationService.createNotification({
    user_id: data.user_id,
    type: NOTIFICATION_TYPES.ORDER_SHIPPED,
    title: 'Tracking Update',
    message: `Your order tracking status is now: ${tracking_status.replace(/_/g, ' ').toUpperCase()}.`,
    data: { order_id: id, tracking_status },
  });

  return data;
};

// ─── GET TRACKING ───────────────────────────────────────────────────────────

const getTracking = async (id, userId = null) => {
  let query = db
    .from('orders')
    .select('id, tracking_id, tracking_status, status, payment_status, created_at, updated_at')
    .eq('id', id);

  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query.single();
  if (error || !data) throw new AppError('Order not found.', 404);
  return data;
};

// ─── CANCEL ORDER ───────────────────────────────────────────────────────────

const cancelOrder = async (id, userId) => {
  const { data: order, error } = await db
    .from('orders')
    .select('id, status, payment_status, order_items(*)')
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
    .update({
      status: ORDER_STATUSES.CANCELLED,
      tracking_status: TRACKING_STATUSES.CANCELLED,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  // Restore inventory only if payment was completed (inventory was deducted)
  if (order.payment_status === PAYMENT_STATUSES.PAID) {
    for (const item of order.order_items) {
      await db.rpc('increment_inventory', { p_watch_id: item.watch_id, p_quantity: item.quantity });
    }
  }

  return true;
};

// ─── GET INVOICE ────────────────────────────────────────────────────────────

const getInvoice = async (id, userId) => {
  const order = await getOrderById(id, userId);
  return order;
};

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
