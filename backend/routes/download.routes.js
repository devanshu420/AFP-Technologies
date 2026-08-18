// backend/routes/download.routes.js
import express from "express";
import multer from "multer";
import {
  getPublicPdfs,
  getAllAdminPdfs,
  createPdf,
  updatePdf,
  deletePdf,
  trackDownload,
} from "../controllers/pdf.controller.js";
import { verifyAuth, requireAdmin } from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// 1. Public Routes
router.get("/public", getPublicPdfs);
router.post("/track/:id", trackDownload);

// 2. Admin Routes: Use upload.any() to handle both 'file' and 'pdf' form fields securely
router.get("/admin/all", verifyAuth, requireAdmin, getAllAdminPdfs);
router.post("/admin/create", verifyAuth, requireAdmin, upload.any(), createPdf);
router.put("/admin/:id", verifyAuth, requireAdmin, upload.any(), updatePdf);
router.delete("/admin/:id", verifyAuth, requireAdmin, deletePdf);

export default router;
