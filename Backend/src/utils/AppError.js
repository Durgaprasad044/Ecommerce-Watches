'use strict';

class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - True for expected/handled errors
   */
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = statusCode >= 500 ? 'error' : 'fail';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
