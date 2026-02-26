'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const notificationService = require('./notification.service');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getNotifications(req.user.id);
  return sendSuccess(res, notifications, 'Notifications retrieved.');
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user.id);
  return sendSuccess(res, notification, 'Notification marked as read.');
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  return sendSuccess(res, null, 'All notifications marked as read.');
});

const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user.id);
  return sendSuccess(res, null, 'Notification deleted.');
});

const broadcastNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.broadcastNotification(req.body);
  return sendSuccess(res, result, `Notification broadcast to ${result.recipients} users.`, 201);
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification, broadcastNotification };
