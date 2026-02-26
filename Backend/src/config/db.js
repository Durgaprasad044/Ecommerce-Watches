'use strict';

const { supabaseAdmin } = require('./supabase');

/**
 * Thin abstraction layer over supabaseAdmin for direct DB queries.
 * Provides a consistent interface and makes future DB migrations easier.
 *
 * Usage: db.from('table_name').select('*')
 */
const db = supabaseAdmin;

module.exports = db;
