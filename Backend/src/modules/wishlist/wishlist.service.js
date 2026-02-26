'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getWishlist = async (userId) => {
  const { data, error } = await db
    .from('wishlist_items')
    .select('id, created_at, watches(id, name, brand, price, images, average_rating, inventory(quantity))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch wishlist.', 500, false);
  return data;
};

const toggleWishlist = async (userId, watchId) => {
  // Check if already in wishlist
  const { data: existing } = await db
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('watch_id', watchId)
    .single();

  if (existing) {
    // Remove
    await db.from('wishlist_items').delete().eq('id', existing.id);
    return { action: 'removed' };
  }

  // Check watch exists
  const { data: watch } = await db.from('watches').select('id').eq('id', watchId).eq('is_deleted', false).single();
  if (!watch) throw new AppError('Watch not found.', 404);

  // Add
  await db.from('wishlist_items').insert({ user_id: userId, watch_id: watchId });
  return { action: 'added' };
};

const removeFromWishlist = async (userId, watchId) => {
  const { error } = await db
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('watch_id', watchId);
  if (error) throw new AppError('Failed to remove from wishlist.', 500, false);
  return true;
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
