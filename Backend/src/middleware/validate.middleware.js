'use strict';

/**
 * Generic schema validation middleware factory.
 * Validates req.body, req.query, or req.params against a Joi schema.
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @param {'body'|'query'|'params'} [source='body'] - Request property to validate
 * @returns {Function} Express middleware
 *
 * Usage: router.post('/register', validate(registerSchema), controller)
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,       // Return all validation errors, not just the first
    stripUnknown: true,      // Remove unknown keys from the validated object
    allowUnknown: false,
  });

  if (error) {
    const messages = error.details.map((d) => d.message.replace(/['"]/g, ''));
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    });
  }

  // Replace request property with sanitized/coerced value
  req[source] = value;
  return next();
};

module.exports = validate;
