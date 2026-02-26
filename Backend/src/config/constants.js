'use strict';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const PAGINATION_LIMIT = 20;

const TOKEN_EXPIRY = {
  ACCESS: '7d',
  REFRESH: '30d',
  RESET_PASSWORD: '1h',
};

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

module.exports = {
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  PAGINATION_LIMIT,
  TOKEN_EXPIRY,
  ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
};
