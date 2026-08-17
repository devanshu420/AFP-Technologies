import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function getAllBrochures(req, res) {
  try {
    const { category, search } = req.query;

    // Filter: active true (ya active field absent ho to bhi) + pdf.url valid string ho
    const filter = {
      active: { $ne: false },
      'pdf.url': { $exists: true, $nin: ['', null] },
    };

    if (category && category !== 'ALL') {
      filter.$or = [{ category: category }, { 'category.name': category }];
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'pdf.name': { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Product.find(filter)
      .populate('category', 'name slug')
      .lean();

    const formattedDownloads = items
      .filter((prod) => prod.pdf && prod.pdf.url && prod.pdf.url.trim() !== '')
      .map((prod) => {
        const cleanName = (prod.pdf?.name || prod.name || 'specification')
          .replace(/\.pdf$/i, '')
          .trim()
          .replace(/\s+/g, '-');

        const fileName = `${cleanName}-afptechnologies.pdf`;

        return {
          _id: prod._id,
          productId: prod.slug || prod._id,
          productName: prod.name,
          categoryName: prod.category?.name || 'Industrial Machinery',
          pdfUrl: prod.pdf.url,
          displayName: fileName,
          downloadUrl: `${prod.pdf.url}${
            prod.pdf.url.includes('?') ? '&' : '?'
          }ik-attachment=true&response-content-disposition=attachment;filename=${encodeURIComponent(
            fileName
          )}`,
        };
      });

    return successResponse(res, formattedDownloads, 'Downloads retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message || 'Failed to retrieve brochures', 500);
  }
}