'use strict';

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

const PAYMENT_METHODS = {
  RAZORPAY: 'razorpay',
  COD: 'cod',
  WALLET: 'wallet',
};

const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const TRACKING_STATUSES = {
  PLACED: 'placed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const NOTIFICATION_TYPES = {
  ORDER_PLACED: 'order_placed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  ORDER_CANCELLED: 'order_cancelled',
  LOW_STOCK: 'low_stock',
  REVIEW_APPROVED: 'review_approved',
  REFERRAL_EARNED: 'referral_earned',
};

const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_SHIPPING: 'free_shipping',
};

const INVENTORY_LOG_TYPES = {
  SALE: 'sale',
  RESTOCK: 'restock',
  ADJUSTMENT: 'adjustment',
  RETURN: 'return',
};

module.exports = {
  USER_ROLES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  TRACKING_STATUSES,
  NOTIFICATION_TYPES,
  COUPON_TYPES,
  INVENTORY_LOG_TYPES,
};
