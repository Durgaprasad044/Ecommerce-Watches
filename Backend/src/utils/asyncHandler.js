'use strict';

/**
 * Wraps an async Express route handler to catch promise rejections
 * and forward them to the global error middleware via next(err).
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
