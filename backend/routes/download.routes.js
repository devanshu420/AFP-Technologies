import express from 'express';
import { getAllBrochures } from '../controllers/download.controller.js';

const router = express.Router();

// Public route to fetch all machinery PDF documents
router.get('/', getAllBrochures);

export default router;