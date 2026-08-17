import express from 'express';
import {
  getContactSettings,
  updateContactSettings,
} from '../controllers/settings.controller.js';
import { verifyAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Website par Phone aur Email fetch karne ke liye
router.get('/contact', getContactSettings);

// Protected: Sirf Admin phone aur email update kar sake
router.put('/contact', verifyAuth, requireAdmin, updateContactSettings);

export default router;