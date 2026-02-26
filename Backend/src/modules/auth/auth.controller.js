'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return sendSuccess(res, user, 'Account created successfully.', 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, result, 'Login successful.');
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.headers.authorization?.split(' ')[1]);
  return sendSuccess(res, null, 'Logged out successfully.');
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;
  const tokens = await authService.refreshToken(refresh_token);
  return sendSuccess(res, tokens, 'Token refreshed successfully.');
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return sendSuccess(res, null, 'If this email exists, a reset link has been sent.');
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.user.id, req.body.password);
  return sendSuccess(res, null, 'Password reset successfully.');
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, user, 'User profile retrieved.');
});

module.exports = { register, login, logout, refreshToken, forgotPassword, resetPassword, getMe };
