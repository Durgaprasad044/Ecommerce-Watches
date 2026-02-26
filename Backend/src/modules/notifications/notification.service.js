'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');
const { NOTIFICATION_TYPES } = require('../../utils/constants');

/**
 * Create a notification record in the DB.
 * @param {object} payload
 * @param {string} payload.user_id - Target user (null for admin-only notifications)
 * @param {string} payload.type - Notification type from NOTIFICATION_TYPES
 * @param {string} payload.title
 * @param {string} payload.message
 * @param {object} [payload.data] - Optional extra JSON data
 * @param {boolean} [payload.is_admin] - True for admin-targeted notifications
 */
const createNotification = async ({ user_id, type, title, message, data = {}, is_admin = false }) => {
  const { error } = await db.from('notifications').insert({
    user_id: user_id || null,
    type,
    title,
    message,
    data,
    is_admin,
    is_read: false,
  });

  if (error) {
    // Notifications failing should not crash the app — log silently
    const logger = require('../../utils/logger');
    logger.warn({ message: 'Failed to create notification', error: error.message });
  }
};

const getNotifications = async (userId) => {
  const { data, error } = await db
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new AppError('Failed to fetch notifications.', 500, false);
  return data;
};

const markAsRead = async (id, userId) => {
  const { data, error } = await db
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) throw new AppError('Notification not found.', 404);
  return data;
};

const markAllAsRead = async (userId) => {
  const { error } = await db
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new AppError('Failed to mark notifications as read.', 500, false);
  return true;
};

const deleteNotification = async (id, userId) => {
  const { error } = await db
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new AppError('Failed to delete notification.', 500, false);
  return true;
};

const broadcastNotification = async ({ title, message, type = 'broadcast', data = {} }) => {
  // Fetch all active users and insert notifications for each
  const { data: users, error } = await db
    .from('users')
    .select('id')
    .eq('is_deleted', false);

  if (error) throw new AppError('Failed to fetch users for broadcast.', 500, false);

  const notifications = users.map((u) => ({
    user_id: u.id,
    type,
    title,
    message,
    data,
    is_read: false,
  }));

  if (notifications.length > 0) {
    await db.from('notifications').insert(notifications);
  }

  return { recipients: notifications.length };
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  broadcastNotification,
};
