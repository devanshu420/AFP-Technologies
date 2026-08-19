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
import { requireAdmin } from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// 1. Public Routes
router.get("/public", getPublicPdfs);
router.post("/track/:id", trackDownload);

// 2. Admin Routes: Using requireAdmin middleware directly
router.get("/admin/all", requireAdmin, getAllAdminPdfs);

router.post("/", requireAdmin, upload.any(), createPdf);
router.post("/admin/create", requireAdmin, upload.any(), createPdf);

router.put("/admin/:id", requireAdmin, upload.any(), updatePdf);
router.delete("/admin/:id", requireAdmin, deletePdf);

export default router;