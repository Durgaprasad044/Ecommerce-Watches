'use strict';

const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const defaultOptions = {
  standardHeaders: true,  // Send RateLimit-* headers
  legacyHeaders: false,   // Do not send X-RateLimit-* headers
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  },
};

/**
 * General API rate limiter: 100 requests per 15 minutes.
 */
const generalLimiter = rateLimit({
  ...defaultOptions,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_GENERAL,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

/**
 * Auth route limiter: 10 requests per 15 minutes.
 * Applied to /register, /login, /forgot-password, /reset-password.
 */
const authLimiter = rateLimit({
  ...defaultOptions,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_AUTH,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

/**
 * File upload limiter: 20 requests per hour.
 */
const uploadLimiter = rateLimit({
  ...defaultOptions,
  windowMs: env.RATE_LIMIT_UPLOAD_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_UPLOAD,
  message: 'Too many upload requests. Please try again after 1 hour.',
});

module.exports = { generalLimiter, authLimiter, uploadLimiter };
