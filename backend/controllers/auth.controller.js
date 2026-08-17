import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import AuditLog from '../models/AuditLog.js';
import { generateSessionToken, COOKIE_NAME } from '../middleware/auth.middleware.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Helper: Record Audit Log
async function recordAuditLog({ adminEmail, action, entity, entityId, req, details = {} }) {
  try {
    await AuditLog.create({
      adminEmail,
      action,
      entity,
      entityId,
      details,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
  } catch (err) {
    console.warn('AuditLog creation failed:', err.message);
  }
}

// 1. POST /api/auth/admin/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
      active: true,
    });

    if (!admin) {
      await recordAuditLog({
        adminEmail: email.toLowerCase().trim(),
        action: 'FAILED_LOGIN',
        entity: 'Admin',
        details: { reason: 'User not found or inactive' },
        req,
      });
      return errorResponse(res, 'Invalid credentials', 401, 'AUTH_FAILED');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      await recordAuditLog({
        adminEmail: admin.email,
        action: 'FAILED_LOGIN',
        entity: 'Admin',
        entityId: admin._id.toString(),
        details: { reason: 'Incorrect password' },
        req,
      });
      return errorResponse(res, 'Invalid credentials', 401, 'AUTH_FAILED');
    }

    // Update last login timestamp
    admin.lastLoginAt = new Date();
    await admin.save();

    // Sign JWT Token with payload
    const token = generateSessionToken({
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Record successful audit log
    await recordAuditLog({
      adminEmail: admin.email,
      action: 'LOGIN',
      entity: 'Admin',
      entityId: admin._id.toString(),
      req,
    });

    // Set secure JWT cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    return successResponse(
      res,
      {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      'Admin authenticated successfully'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// 2. GET /api/auth/admin/me (Verify active JWT session)
export async function getMe(req, res) {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    if (!admin || !admin.active) {
      return errorResponse(res, 'Admin account inactive or removed', 401, 'UNAUTHORIZED');
    }

    return successResponse(res, {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// 3. POST /api/auth/admin/logout
export async function logout(req, res) {
  try {
    if (req.admin?.email) {
      await recordAuditLog({
        adminEmail: req.admin.email,
        action: 'LOGOUT',
        entity: 'Admin',
        entityId: req.admin.id || null,
        req,
      });
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}