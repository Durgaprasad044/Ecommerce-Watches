'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getWatchReviews = async (watchId, { page = 1, limit = 20 }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await db
    .from('reviews')
    .select('*, users(name, avatar_url)', { count: 'exact' })
    .eq('watch_id', watchId)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch reviews.', 500, false);
  return { data, total: count, page, limit };
};

const createReview = async (userId, watchId, reviewData) => {
  // Check for verified purchase
  const { data: purchase } = await db
    .from('order_items')
    .select('id, orders!inner(user_id, status)')
    .eq('watch_id', watchId)
    .eq('orders.user_id', userId)
    .eq('orders.status', 'delivered')
    .limit(1)
    .single();

  if (!purchase) {
    throw new AppError('You can only review watches you have purchased and received.', 403);
  }

  // Check for existing review
  const { data: existing } = await db
    .from('reviews')
    .select('id')
    .eq('watch_id', watchId)
    .eq('user_id', userId)
    .single();

  if (existing) throw new AppError('You have already reviewed this watch.', 409);

  const { data, error } = await db
    .from('reviews')
    .insert({ ...reviewData, watch_id: watchId, user_id: userId })
    .select()
    .single();

  if (error) throw new AppError('Failed to create review.', 500, false);

  // Update average rating on watch
  await updateWatchAverageRating(watchId);

  return data;
};

const updateReview = async (id, userId, updates) => {
  const { data, error } = await db
    .from('reviews')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) throw new AppError('Review not found or unauthorized.', 404);

  await updateWatchAverageRating(data.watch_id);
  return data;
};

const deleteReview = async (id, userId) => {
  const { data: review } = await db.from('reviews').select('watch_id').eq('id', id).eq('user_id', userId).single();
  if (!review) throw new AppError('Review not found or unauthorized.', 404);

  await db.from('reviews').delete().eq('id', id);
  await updateWatchAverageRating(review.watch_id);
  return true;
};

const updateWatchAverageRating = async (watchId) => {
  const { data } = await db
    .from('reviews')
    .select('rating')
    .eq('watch_id', watchId);

  if (!data || data.length === 0) {
    await db.from('watches').update({ average_rating: null, review_count: 0 }).eq('id', watchId);
    return;
  }

  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  await db.from('watches').update({ average_rating: parseFloat(avg.toFixed(2)), review_count: data.length }).eq('id', watchId);
};

module.exports = { getWatchReviews, createReview, updateReview, deleteReview };
