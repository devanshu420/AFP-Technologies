import express from 'express';
import {
  uploadImage,
  uploadPdf,
  deleteImageKitAsset,
} from '../controllers/upload.controller.js';
import {
  uploadImageMiddleware,
  uploadPdfMiddleware,
} from '../middleware/upload.middleware.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. Upload Image to /products folder
router.post(
  '/image',
  requireAdmin,
  uploadImageMiddleware.single('image'),
  uploadImage
);

// 2. Upload PDF to /products/pdf folder
router.post(
  '/file',
  requireAdmin,
  uploadPdfMiddleware.single('file'),
  uploadPdf
);

// 3. Delete Asset from ImageKit
router.delete('/delete', requireAdmin, deleteImageKitAsset);

export default router;