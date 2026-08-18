import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'fallback-secret-key-min-32-chars';

// 1. Generate JWT Token
export function generateSessionToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '8h',
  });
}

// 2. Verify JWT Token
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

// 3. Admin Authentication Middleware (Bearer Header Validation)
export function requireAdmin(req, res, next) {
  let token = null;

  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
  }

  if (!token) {
    return errorResponse(res, 'Unauthorized: Access token missing', 401, 'UNAUTHORIZED');
  }

  const admin = verifySessionToken(token);
  if (!admin) {
    return errorResponse(res, 'Unauthorized: Invalid or expired token', 401, 'UNAUTHORIZED');
  }

  req.admin = admin;
  next();
}

// Alias export for compatibility
export const verifyAuth = requireAdmin;