import { errorResponse } from '../utils/response.js';

const tracker = new Map();

export function rateLimit(limit = 10, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const now = Date.now();
    const userData = tracker.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > userData.resetAt) {
      userData.count = 1;
      userData.resetAt = now + windowMs;
    } else {
      userData.count += 1;
    }

    tracker.set(ip, userData);

    if (userData.count > limit) {
      return errorResponse(res, 'Too many requests. Please try again later.', 429, 'RATE_LIMITED');
    }

    next();
  };
}