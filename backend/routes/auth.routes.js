import express from 'express';
import { login, getMe, logout } from '../controllers/auth.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Admin login
router.post('/login', login);

// Protected: Get current authenticated admin info
router.get('/me', requireAdmin, getMe);

// Protected: Logout admin session
router.post('/logout', requireAdmin, logout);

export default router;