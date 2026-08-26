import express from "express";

import {
  getEquipmentRange,
  getAdminEquipmentRange,
  getEquipmentById,
  createEquipmentRange,
  updateEquipmentRange,
  removeFromEquipmentRange,
  addToEquipmentRange,
  deleteEquipmentRange,
} from "../controllers/equipmentRange.controller.js";

import { requireAdmin } from "../middleware/auth.middleware.js";
import { uploadImageMiddleware } from "../middleware/upload.middleware.js";

const router = express.Router();

/*
=========================================================
PUBLIC
=========================================================
*/

// GET /api/equipment-range
router.get("/", getEquipmentRange);


/*
=========================================================
ADMIN
=========================================================
*/

// IMPORTANT:
// /admin must come BEFORE /:id

router.get(
  "/admin",
  requireAdmin,
  getAdminEquipmentRange
);

router.post(
  "/",
  requireAdmin,
  uploadImageMiddleware.single("image"), 
  createEquipmentRange
);

router.put(
  "/:id",
  requireAdmin,
  uploadImageMiddleware.single("image"), 
  updateEquipmentRange
);
router.patch(
  "/:id/remove",
  requireAdmin,
  removeFromEquipmentRange
);

router.patch(
  "/:id/add",
  requireAdmin,
  addToEquipmentRange
);

router.delete(
  "/:id",
  requireAdmin,
  deleteEquipmentRange
);


/*
=========================================================
PUBLIC SINGLE EQUIPMENT
=========================================================
*/

// Keep this LAST
router.get(
  "/:id",
  getEquipmentById
);

export default router;