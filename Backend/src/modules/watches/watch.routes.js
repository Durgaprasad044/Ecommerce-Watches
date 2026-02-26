'use strict';

const { Router } = require('express');
const watchController = require('./watch.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const validate = require('../../middleware/validate.middleware');
const { generalLimiter, uploadLimiter } = require('../../middleware/rateLimiter.middleware');
const { uploadMultiple } = require('../../middleware/upload.middleware');
const { createWatchSchema, updateWatchSchema, watchQuerySchema, searchQuerySchema } = require('./watch.validator');
const { USER_ROLES } = require('../../utils/constants');

const router = Router();

router.use(generalLimiter);

// Public routes
router.get('/', validate(watchQuerySchema, 'query'), watchController.getAllWatches);
router.get('/featured', watchController.getFeaturedWatches);
router.get('/search', validate(searchQuerySchema, 'query'), watchController.searchWatches);
router.get('/:id', watchController.getWatchById);

// Admin-only routes
router.post('/', authMiddleware, requireRole(USER_ROLES.ADMIN), validate(createWatchSchema), watchController.createWatch);
router.put('/:id', authMiddleware, requireRole(USER_ROLES.ADMIN), validate(updateWatchSchema), watchController.updateWatch);
router.delete('/:id', authMiddleware, requireRole(USER_ROLES.ADMIN), watchController.deleteWatch);
router.post(
  '/:id/images',
  authMiddleware,
  requireRole(USER_ROLES.ADMIN),
  uploadLimiter,
  uploadMultiple('images', 5),
  watchController.uploadWatchImages
);

module.exports = router;
