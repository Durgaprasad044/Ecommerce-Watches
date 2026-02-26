'use strict';

const db = require('../../config/db');
const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');
const env = require('../../config/env');
const { PAGINATION_LIMIT } = require('../../config/constants');

const getAllUsers = async ({ page = 1, limit = PAGINATION_LIMIT }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await db
    .from('users')
    .select('id, name, email, role, avatar_url, phone, created_at', { count: 'exact' })
    .eq('is_deleted', false)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch users.', 500, false);

  return { data, total: count, page, limit };
};

const getUserById = async (id) => {
  const { data, error } = await db
    .from('users')
    .select('id, name, email, role, avatar_url, phone, address, referral_code, created_at')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error || !data) throw new AppError('User not found.', 404);
  return data;
};

const updateUser = async (id, updates) => {
  const { data, error } = await db
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_deleted', false)
    .select('id, name, email, role, avatar_url, phone, address')
    .single();

  if (error) throw new AppError('Failed to update user.', 500, false);
  if (!data) throw new AppError('User not found.', 404);
  return data;
};

const deleteUser = async (id) => {
  // Soft delete
  const { error } = await db
    .from('users')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new AppError('Failed to delete user.', 500, false);

  // Disable auth account
  await supabaseAdmin.auth.admin.updateUserById(id, { banned: true });

  return true;
};

const getUserOrders = async (userId) => {
  const { data, error } = await db
    .from('orders')
    .select('*, order_items(*, watches(name, images))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch user orders.', 500, false);
  return data;
};

const getUserWishlist = async (userId) => {
  const { data, error } = await db
    .from('wishlist_items')
    .select('*, watches(id, name, brand, price, images, average_rating)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch user wishlist.', 500, false);
  return data;
};

const getAvatarUploadUrl = async (userId, fileName, contentType) => {
  const filePath = `avatars/${userId}/${Date.now()}-${fileName}`;
  const { data, error } = await supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(filePath);

  if (error) throw new AppError('Failed to generate upload URL.', 500, false);
  return { upload_url: data.signedUrl, file_path: filePath };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserOrders,
  getUserWishlist,
  getAvatarUploadUrl,
};
