'use strict';

const AppError = require('../utils/AppError');
const { supabaseAnon } = require('../config/supabase');

/**
 * Extracts and verifies the JWT from the Authorization Bearer header.
 * On success, attaches req.user = { id, email, role }.
 * Throws 401 if token is missing or invalid.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization token is required.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authorization token is required.', 401);
    }

    // Verify token with Supabase
    const { data, error } = await supabaseAnon.auth.getUser(token);

    if (error || !data?.user) {
      throw new AppError('Invalid or expired token.', 401);
    }

    const user = data.user;

    // Attach normalized user object to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || user.app_metadata?.role || 'user',
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
