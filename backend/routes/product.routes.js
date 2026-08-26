import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/product.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();


// Search Route
router.get("/search", searchProducts);

// Public endpoints
router.get('/', getAllProducts);
router.get('/:id', getProductById);



// Admin-only protected endpoints
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;