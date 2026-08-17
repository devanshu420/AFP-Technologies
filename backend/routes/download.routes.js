// backend/routes/download.routes.js
import express from 'express';
import {
  getPublicPdfs,
  getAllAdminPdfs,
  createPdf,
  updatePdf,
  deletePdf,
  trackDownload,
} from '../controllers/pdf.controller.js';
import { verifyAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. Public Routes
router.get('/public', getPublicPdfs);
router.post('/track/:id', trackDownload);

// 2. Admin Routes (Make sure path is /admin/all)
router.get('/admin/all', verifyAuth, requireAdmin, getAllAdminPdfs);
router.post('/admin/create', verifyAuth, requireAdmin, createPdf);
router.put('/admin/:id', verifyAuth, requireAdmin, updatePdf);
router.delete('/admin/:id', verifyAuth, requireAdmin, deletePdf);

export default router;