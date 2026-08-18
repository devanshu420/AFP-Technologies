import express from 'express';
import {
  getActiveAnnouncement,
  getAllAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.controller.js';
import { verifyAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. Public Route: Get active hero announcement/ad
router.get('/public', getActiveAnnouncement);

// 2. Admin Routes: Manage announcements (CRUD)
router.get('/admin/all', verifyAuth, requireAdmin, getAllAdminAnnouncements);
router.post('/admin/create', verifyAuth, requireAdmin, createAnnouncement);
router.put('/admin/:id', verifyAuth, requireAdmin, updateAnnouncement);
router.delete('/admin/:id', verifyAuth, requireAdmin, deleteAnnouncement);

export default router;