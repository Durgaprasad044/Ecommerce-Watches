'use strict';

const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Global Express error handler.
 * Must be registered as the LAST middleware in app.js.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let isOperational = err.isOperational || false;

  // Handle Supabase / Postgres errors
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        statusCode = 409;
        message = 'A resource with these details already exists.';
        isOperational = true;
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        message = 'Related resource does not exist.';
        isOperational = true;
        break;
      case 'PGRST116': // row not found (PostgREST)
        statusCode = 404;
        message = 'Resource not found.';
        isOperational = true;
        break;
      case '42501': // insufficient_privilege
        statusCode = 403;
        message = 'Insufficient database privileges.';
        isOperational = true;
        break;
      default:
        break;
    }
  }

  // Log error details
  if (!isOperational || statusCode >= 500) {
    logger.error({
      message: err.message,
      statusCode,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn({ message, statusCode, url: req.originalUrl, method: req.method });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
