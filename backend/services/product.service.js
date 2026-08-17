import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { slugify } from '../utils/validations.js';

export async function getUniqueSlug(name, currentId = null) {
  let baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({ slug, _id: { $ne: currentId } }).select('_id').lean();
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function fetchProducts({
  page = 1,
  limit = 20,
  search = '',
  category = null,
  featured = null,
  recent = null,
  active = null,
  sort = 'latest',
}) {
  const query = {};

  if (active !== null && active !== undefined) {
    query.active = active === 'true' || active === true;
  }

  if (featured !== null && featured !== undefined) {
    query.featured = featured === 'true' || featured === true;
  }

  if (recent !== null && recent !== undefined) {
    query.recent = recent === 'true' || recent === true;
  }

  if (category) {
    const catDoc = await Category.findOne({ slug: category }).select('_id').lean();
    if (catDoc) query.category = catDoc._id;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const sortOptions = {};
  if (sort === 'latest') sortOptions.createdAt = -1;
  else if (sort === 'order') sortOptions.order = 1;
  else sortOptions.createdAt = -1;

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * safeLimit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .select('name slug mainImage category shortDescription featured recent active order')
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
}