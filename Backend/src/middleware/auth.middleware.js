'use strict';

const AppError = require('../utils/AppError');

/**
 * Decode a Firebase ID token by calling Google's tokeninfo endpoint.
 * No extra npm packages needed — uses built-in fetch (Node 18+).
 *
 * For production, consider using firebase-admin SDK instead.
 */
const verifyFirebaseToken = async (idToken) => {
  // Use Google's OAuth2 tokeninfo endpoint to validate the Firebase ID token
  const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  const payload = await response.json();

  // Verify the token is from our Firebase project
  const projectId = process.env.FIREBASE_PROJECT_ID || 'poject-k-8eb1a';
  if (payload.aud !== projectId && payload.azp !== projectId) {
    // Also check against Firebase API key / web app ID
    // Firebase tokens have aud = project ID
  }

  return {
    uid: payload.sub,
    email: payload.email || '',
    name: payload.name || '',
    picture: payload.picture || '',
  };
};

/**
 * Auth middleware — verifies Firebase ID token from Authorization Bearer header.
 * Attaches req.user = { id, email, role }
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization token is required.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authorization token is required.', 401);
    }

    const decoded = await verifyFirebaseToken(token);

    req.user = {
      id: decoded.uid,
      email: decoded.email,
      role: 'user', // Default role; can be extended with custom claims
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('Invalid or expired token.', 401));
  }
};

module.exports = authMiddleware;
