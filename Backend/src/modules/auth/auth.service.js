'use strict';

const AppError = require('../../utils/AppError');
const db = require('../../config/db');
const { supabaseAnon, supabaseAdmin } = require('../../config/supabase');
const { USER_ROLES } = require('../../utils/constants');
const { nanoid } = require('nanoid');
const env = require('../../config/env');

/**
 * Register a new user with Supabase Auth, then insert a record in the users table.
 */
const register = async ({ name, email, password, referral_code }) => {
  // 1. Create auth user in Supabase
  const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: env.isDev(), // Auto-confirm in dev; require email confirm in prod
    user_metadata: { name, role: USER_ROLES.USER },
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      throw new AppError('An account with this email already exists.', 409);
    }
    throw new AppError(signUpError.message, 400);
  }

  const userId = authData.user.id;

  // 2. Generate a unique referral code for this new user
  const newReferralCode = nanoid(8).toUpperCase();

  // 3. Insert into public users table
  const { error: dbError } = await db
    .from('users')
    .insert({
      id: userId,
      name,
      email,
      role: USER_ROLES.USER,
      referral_code: newReferralCode,
    });

  if (dbError) {
    // Roll back auth user creation
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw new AppError('Failed to create user profile.', 500, false);
  }

  // 4. Handle referral code if provided
  if (referral_code) {
    const { data: referrer } = await db
      .from('users')
      .select('id')
      .eq('referral_code', referral_code)
      .single();

    if (referrer) {
      await db.from('referrals').insert({
        referrer_id: referrer.id,
        referred_id: userId,
        code_used: referral_code,
        status: 'pending',
      });
    }
  }

  return {
    id: userId,
    name,
    email,
    referral_code: newReferralCode,
  };
};

/**
 * Log in with email and password via Supabase Auth.
 * Returns the session tokens.
 */
const login = async ({ email, password }) => {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AppError('Invalid email or password.', 401);
  }

  const { user, session } = data;

  // Fetch user profile from DB
  const { data: profile, error: profileError } = await db
    .from('users')
    .select('id, name, email, role, avatar_url, referral_code')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new AppError('User profile not found.', 404);
  }

  return {
    user: profile,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
  };
};

/**
 * Sign out the current user (invalidates the session on Supabase).
 */
const logout = async (accessToken) => {
  const { error } = await supabaseAnon.auth.signOut();
  if (error) {
    throw new AppError('Logout failed.', 500, false);
  }
  return true;
};

/**
 * Refresh access token using the refresh token.
 */
const refreshToken = async (token) => {
  const { data, error } = await supabaseAnon.auth.refreshSession({ refresh_token: token });

  if (error || !data.session) {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  };
};

/**
 * Send password reset email via Supabase Auth.
 */
const forgotPassword = async (email) => {
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.FRONTEND_URL}/reset-password`,
  });

  if (error) {
    throw new AppError('Failed to send reset email.', 500, false);
  }

  return true;
};

/**
 * Update password for the authenticated user.
 * The new password is set directly via admin client (token already verified by authMiddleware).
 */
const resetPassword = async (userId, newPassword) => {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    throw new AppError('Failed to reset password.', 500, false);
  }

  return true;
};

/**
 * Get current authenticated user profile.
 */
const getMe = async (userId) => {
  const { data, error } = await db
    .from('users')
    .select('id, name, email, role, avatar_url, phone, address, referral_code, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError('User not found.', 404);
  }

  return data;
};

module.exports = { register, login, logout, refreshToken, forgotPassword, resetPassword, getMe };
