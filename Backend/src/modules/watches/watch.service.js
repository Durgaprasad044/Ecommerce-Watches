'use strict';

const db = require('../../config/db');
const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');
const env = require('../../config/env');
const { PAGINATION_LIMIT } = require('../../config/constants');

const buildFilterQuery = (query, filters) => {
  const { brand, category, min_price, max_price, sort, featured } = filters;
  if (brand) query = query.ilike('brand', `%${brand}%`);
  if (category) query = query.eq('category', category);
  if (min_price !== undefined) query = query.gte('price', min_price);
  if (max_price !== undefined) query = query.lte('price', max_price);
  if (featured !== undefined) query = query.eq('is_featured', featured);

  switch (sort) {
    case 'price_asc': query = query.order('price', { ascending: true }); break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    case 'rating': query = query.order('average_rating', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false });
  }
  return query;
};

const getAllWatches = async ({ page = 1, limit = PAGINATION_LIMIT, ...filters }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = db
    .from('watches')
    .select('*, inventory(quantity, reserved_quantity)', { count: 'exact' })
    .eq('is_deleted', false);

  query = buildFilterQuery(query, filters);
  const { data, error, count } = await query.range(from, to);

  if (error) throw new AppError('Failed to fetch watches.', 500, false);
  return { data, total: count, page, limit };
};

const getWatchById = async (id) => {
  const { data, error } = await db
    .from('watches')
    .select('*, inventory(quantity, reserved_quantity), reviews(id, rating, title, body, created_at, users(name, avatar_url))')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error || !data) throw new AppError('Watch not found.', 404);
  return data;
};

const getFeaturedWatches = async () => {
  const { data, error } = await db
    .from('watches')
    .select('*, inventory(quantity)')
    .eq('is_featured', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Failed to fetch featured watches.', 500, false);
  return data;
};

const searchWatches = async ({ q, page = 1, limit = PAGINATION_LIMIT }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await db
    .from('watches')
    .select('*, inventory(quantity)', { count: 'exact' })
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%,model.ilike.%${q}%,description.ilike.%${q}%`)
    .eq('is_deleted', false)
    .range(from, to);

  if (error) throw new AppError('Search failed.', 500, false);
  return { data, total: count, page, limit };
};

const createWatch = async (watchData) => {
  const { stock_quantity, ...watch } = watchData;

  const { data, error } = await db
    .from('watches')
    .insert(watch)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new AppError('A watch with this SKU already exists.', 409);
    throw new AppError('Failed to create watch.', 500, false);
  }

  // Create inventory record
  await db.from('inventory').insert({
    watch_id: data.id,
    quantity: stock_quantity,
    reserved_quantity: 0,
    low_stock_threshold: 5,
  });

  return data;
};

const updateWatch = async (id, updates) => {
  const { data, error } = await db
    .from('watches')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_deleted', false)
    .select()
    .single();

  if (error) throw new AppError('Failed to update watch.', 500, false);
  if (!data) throw new AppError('Watch not found.', 404);
  return data;
};

const deleteWatch = async (id) => {
  const { error } = await db
    .from('watches')
    .update({ is_deleted: true })
    .eq('id', id);

  if (error) throw new AppError('Failed to delete watch.', 500, false);
  return true;
};

const uploadWatchImages = async (watchId, files) => {
  const uploadedUrls = [];

  for (const file of files) {
    const filePath = `watches/${watchId}/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new AppError(`Failed to upload image: ${file.originalname}`, 500, false);

    const { data: urlData } = supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(filePath);

    uploadedUrls.push(urlData.publicUrl);
  }

  // Append new image URLs to the watch record
  const { data: watch } = await db
    .from('watches')
    .select('images')
    .eq('id', watchId)
    .single();

  const merged = [...(watch?.images || []), ...uploadedUrls];

  await db
    .from('watches')
    .update({ images: merged })
    .eq('id', watchId);

  return uploadedUrls;
};

module.exports = {
  getAllWatches,
  getWatchById,
  getFeaturedWatches,
  searchWatches,
  createWatch,
  updateWatch,
  deleteWatch,
  uploadWatchImages,
};
