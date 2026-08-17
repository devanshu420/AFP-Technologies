import express from 'express';
import {
  createPublicEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
} from '../controllers/enquiry.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route for frontend contact form
router.post('/contact', createPublicEnquiry);
router.post('/', createPublicEnquiry);

// Admin protected routes
router.get('/', requireAdmin, getAllEnquiries);
router.put('/:id', requireAdmin, updateEnquiryStatus);

export default router;