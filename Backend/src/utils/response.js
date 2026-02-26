'use strict';

/**
 * Standardised API response helpers.
 * All controllers must use these — no direct res.json() formatting.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} [message='Success']
 * @param {number} [statusCode=200]
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response (rarely used directly — prefer errorHandler).
 * @param {import('express').Response} res
 * @param {string} [message='An error occurred']
 * @param {number} [statusCode=500]
 */
const sendError = (res, message = 'An error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

/**
 * Send a paginated response.
 * @param {import('express').Response} res
 * @param {Array} data
 * @param {object} pagination - { page, limit, total }
 * @param {string} [message='Success']
 * @param {number} [statusCode=200]
 */
const sendPaginated = (res, data, pagination, message = 'Success', statusCode = 200) => {
  const { page = 1, limit = 20, total = 0 } = pagination;
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
