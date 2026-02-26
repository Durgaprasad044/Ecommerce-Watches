'use strict';

const dotenv = require('dotenv');
dotenv.config();

const _required = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'JWT_SECRET',
];

const _missing = _required.filter((key) => !process.env[key]);
if (_missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${_missing.join(', ')}`
  );
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

  // Auth
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',

  // App
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

  // Storage
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'watch-images',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX_GENERAL: parseInt(process.env.RATE_LIMIT_MAX_GENERAL, 10) || 100,
  RATE_LIMIT_MAX_AUTH: parseInt(process.env.RATE_LIMIT_MAX_AUTH, 10) || 10,
  RATE_LIMIT_MAX_UPLOAD: parseInt(process.env.RATE_LIMIT_MAX_UPLOAD, 10) || 20,
  RATE_LIMIT_UPLOAD_WINDOW_MS: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS, 10) || 60 * 60 * 1000,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  isProd: () => process.env.NODE_ENV === 'production',
  isDev: () => process.env.NODE_ENV !== 'production',
};

module.exports = env;
