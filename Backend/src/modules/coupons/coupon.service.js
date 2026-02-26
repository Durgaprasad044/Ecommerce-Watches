'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');
const { COUPON_TYPES } = require('../../utils/constants');

const validateCoupon = async (code, orderTotal, userId) => {
  const { data: coupon, error } = await db
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !coupon) throw new AppError('Invalid coupon code.', 400);

  const now = new Date();
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    throw new AppError('This coupon has expired.', 400);
  }
  if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
    throw new AppError('This coupon has reached its usage limit.', 400);
  }
  if (coupon.minimum_order_value && orderTotal < coupon.minimum_order_value) {
    throw new AppError(`Minimum order value is ${coupon.minimum_order_value} to use this coupon.`, 400);
  }

  // Per-user usage check
  if (coupon.uses_per_user) {
    const { count } = await db
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('coupon_id', coupon.id);
    if (count >= coupon.uses_per_user) {
      throw new AppError('You have already used this coupon the maximum number of times.', 400);
    }
  }

  let discount = 0;
  if (coupon.type === COUPON_TYPES.PERCENTAGE) {
    discount = (orderTotal * coupon.value) / 100;
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
  } else if (coupon.type === COUPON_TYPES.FIXED_AMOUNT) {
    discount = Math.min(coupon.value, orderTotal);
  } else if (coupon.type === COUPON_TYPES.FREE_SHIPPING) {
    discount = 0; // Handled at shipping level in order
  }

  return { coupon, discount };
};

const createCoupon = async (couponData) => {
  const { data, error } = await db
    .from('coupons')
    .insert({ ...couponData, code: couponData.code.toUpperCase() })
    .select()
    .single();
  if (error) {
    if (error.code === '23505') throw new AppError('Coupon code already exists.', 409);
    throw new AppError('Failed to create coupon.', 500, false);
  }
  return data;
};

const getAllCoupons = async () => {
  const { data, error } = await db.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) throw new AppError('Failed to fetch coupons.', 500, false);
  return data;
};

const updateCoupon = async (id, updates) => {
  const { data, error } = await db
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error || !data) throw new AppError('Coupon not found.', 404);
  return data;
};

const deleteCoupon = async (id) => {
  const { error } = await db.from('coupons').delete().eq('id', id);
  if (error) throw new AppError('Failed to delete coupon.', 500, false);
  return true;
};

module.exports = { validateCoupon, createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
