import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { slugify, isValidObjectId } from '../utils/validations.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 }).lean();
    return successResponse(res, categories);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createCategory(req, res) {
  try {
    const body = req.body;
    if (!body.name) return errorResponse(res, 'Category name is required', 400);

    const slug = slugify(body.slug || body.name);
    const exists = await Category.findOne({ slug });
    if (exists) return errorResponse(res, 'Category slug already exists', 409, 'DUPLICATE_SLUG');

    const category = await Category.create({ ...body, slug });
    return successResponse(res, category, 'Category created', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return errorResponse(res, 'Invalid ID', 400);

    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    return successResponse(res, category, 'Category updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return errorResponse(res, 'Invalid ID', 400);

    const associatedProducts = await Product.countDocuments({ category: id });
    if (associatedProducts > 0) {
      return errorResponse(
        res,
        `Cannot delete. Category is referenced by ${associatedProducts} products.`,
        400,
        'DEPENDENCY_CONFLICT'
      );
    }

    await Category.findByIdAndDelete(id);
    return successResponse(res, null, 'Category deleted');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}