'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const couponService = require('./coupon.service');

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  return sendSuccess(res, coupon, 'Coupon created.', 201);
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.getAllCoupons();
  return sendSuccess(res, coupons, 'Coupons retrieved.');
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  return sendSuccess(res, coupon, 'Coupon updated.');
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  return sendSuccess(res, null, 'Coupon deleted.');
});

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, order_total } = req.body;
  const result = await couponService.validateCoupon(code, order_total, req.user.id);
  return sendSuccess(res, result, 'Coupon is valid.');
});

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, validateCoupon };
