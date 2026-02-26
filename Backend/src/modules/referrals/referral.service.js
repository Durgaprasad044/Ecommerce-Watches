'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');
const { nanoid } = require('nanoid');

const getMyReferralCode = async (userId) => {
  const { data, error } = await db
    .from('users')
    .select('referral_code')
    .eq('id', userId)
    .single();
  if (error || !data) throw new AppError('User not found.', 404);
  return { referral_code: data.referral_code };
};

const getReferralStats = async (userId) => {
  const { data, error } = await db
    .from('referrals')
    .select('id, status, created_at, referred_id, users!referred_id(name, email)')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch referral stats.', 500, false);

  const total = data.length;
  const converted = data.filter((r) => r.status === 'converted').length;
  const pending = data.filter((r) => r.status === 'pending').length;

  return { total, converted, pending, referrals: data };
};

const getAllReferrals = async () => {
  const { data, error } = await db
    .from('referrals')
    .select('*, users!referrer_id(name, email), users!referred_id(name, email)')
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch referrals.', 500, false);
  return data;
};

const creditReferrerOnFirstPurchase = async (referredUserId) => {
  const { data: referral } = await db
    .from('referrals')
    .select('id, referrer_id, status')
    .eq('referred_id', referredUserId)
    .eq('status', 'pending')
    .single();

  if (!referral) return null;

  // Mark referral as converted
  await db.from('referrals').update({ status: 'converted', converted_at: new Date().toISOString() }).eq('id', referral.id);

  return referral;
};

module.exports = { getMyReferralCode, getReferralStats, getAllReferrals, creditReferrerOnFirstPurchase };
