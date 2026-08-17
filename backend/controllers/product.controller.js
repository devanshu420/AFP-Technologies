import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { imagekit } from '../config/imagekit.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { isValidObjectId } from '../utils/validations.js';

export const generateSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// 1. GET /api/products
export async function getAllProducts(req, res) {
  try {
    const { category, search, active, limit = 150, page = 1 } = req.query;
    const filter = {};

    if (active !== undefined) filter.active = active === 'true';
    if (category && category !== 'ALL') {
      if (isValidObjectId(category)) filter.category = category;
      else filter.$or = [{ type: category }, { 'category.name': category }];
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);
    return successResponse(res, { products, total });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

// 2. GET /api/products/:id
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { slug: id.toLowerCase() };

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .lean();

    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, product);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

// 3. POST /api/products (Create Product)
export async function createProduct(req, res) {
  try {
    const payload = { ...req.body };

    if (!payload.name) return errorResponse(res, 'Product name is required', 400);

    let slug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.name);
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${generateSlug(payload.name)}-${count++}`;
    }
    payload.slug = slug;

    const product = await Product.create(payload);
    return successResponse(res, product, 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

// 4. PUT /api/products/:id (Update Product & Cleanup Old Assets)
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const oldProduct = await Product.findOne(query);
    if (!oldProduct) return errorResponse(res, 'Product not found', 404);

    const payload = { ...req.body };

    // Agar PDF replace hui hai to purani ImageKit se delete karein
    if (
      payload.pdf?.fileId &&
      oldProduct.pdf?.fileId &&
      payload.pdf.fileId !== oldProduct.pdf.fileId
    ) {
      try {
        await imagekit.deleteFile(oldProduct.pdf.fileId);
      } catch (e) {
        console.warn('Could not delete old PDF from ImageKit:', e.message);
      }
    }

    const updated = await Product.findOneAndUpdate(query, payload, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    return successResponse(res, updated);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

// 5. DELETE /api/products/:id (Delete Product + ImageKit Cleanup)
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const product = await Product.findOne(query);
    if (!product) return errorResponse(res, 'Product not found', 404);

    // PDF delete karein
    if (product.pdf?.fileId) {
      try {
        await imagekit.deleteFile(product.pdf.fileId);
      } catch (e) {
        console.warn('PDF deletion warning:', e.message);
      }
    }

    // Images delete karein
    const fileIds = [
      product.mainImage?.fileId,
      ...(product.images?.map((i) => i.fileId) || []),
    ].filter(Boolean);

    for (const fid of fileIds) {
      try {
        await imagekit.deleteFile(fid);
      } catch (e) {
        console.warn('Image deletion warning:', e.message);
      }
    }

    await Product.deleteOne({ _id: product._id });
    return successResponse(res, { message: 'Product deleted successfully' });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}