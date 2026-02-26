'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const referralService = require('./referral.service');

const getMyReferralCode = asyncHandler(async (req, res) => {
  const result = await referralService.getMyReferralCode(req.user.id);
  return sendSuccess(res, result, 'Referral code retrieved.');
});

const getReferralStats = asyncHandler(async (req, res) => {
  const stats = await referralService.getReferralStats(req.user.id);
  return sendSuccess(res, stats, 'Referral stats retrieved.');
});

const getAllReferrals = asyncHandler(async (req, res) => {
  const referrals = await referralService.getAllReferrals();
  return sendSuccess(res, referrals, 'All referrals retrieved.');
});

module.exports = { getMyReferralCode, getReferralStats, getAllReferrals };
