'use strict';

const { Router } = require('express');
const notificationController = require('./notification.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const Joi = require('joi');
const validate = require('../../middleware/validate.middleware');
const { USER_ROLES } = require('../../utils/constants');

const broadcastSchema = Joi.object({
  title: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
  type: Joi.string().trim().optional().default('broadcast'),
  data: Joi.object().optional().default({}),
});

const router = Router();
router.use(generalLimiter);
router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Admin only
router.post('/broadcast', requireRole(USER_ROLES.ADMIN), validate(broadcastSchema), notificationController.broadcastNotification);

module.exports = router;
