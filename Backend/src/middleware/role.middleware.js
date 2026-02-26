'use strict';

const AppError = require('../utils/AppError');

/**
 * Role-based access control middleware factory.
 * Must be used AFTER authMiddleware so req.user is already set.
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'user')
 * @returns {Function} Express middleware
 *
 * Usage: router.get('/admin', authMiddleware, requireRole('admin'), controller)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(
        `Access denied. Required role(s): ${roles.join(', ')}.`,
        403
      )
    );
  }

  return next();
};

module.exports = requireRole;
