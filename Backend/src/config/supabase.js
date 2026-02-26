'use strict';

const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

/**
 * Anon client — restricted by RLS. Use for operations on behalf of the user.
 */
const supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

/**
 * Service role client — bypasses RLS. Use ONLY for admin/server-side operations.
 */
const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = { supabaseAnon, supabaseAdmin };
