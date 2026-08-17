import Pdf from '../models/Pdf.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Public: Get all active PDFs for /downloads page
export async function getPublicPdfs(req, res) {
  try {
    const { category, search } = req.query;
    const filter = { active: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {   
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pdfs = await Pdf.find(filter).sort({ createdAt: -1 });
    return successResponse(res, pdfs, 'PDFs fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Get all PDFs (including inactive)
export async function getAllAdminPdfs(req, res) {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });
    return successResponse(res, pdfs, 'All PDFs retrieved');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Create standalone PDF
export async function createPdf(req, res) {
  try {
    const { title, description, category, fileUrl, fileId, fileName, fileSize, active } = req.body;

    if (!title || !fileUrl) {
      return errorResponse(res, 'Title and PDF File URL are required', 400);
    }

    const pdf = await Pdf.create({
      title,
      description,
      category: category || 'General',
      fileUrl,
      fileId,
      fileName,
      fileSize,
      active: active !== undefined ? active : true,
    });

    return successResponse(res, pdf, 'PDF uploaded successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Update PDF details
export async function updatePdf(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, fileUrl, fileId, fileName, fileSize, active } = req.body;

    const pdf = await Pdf.findById(id);
    if (!pdf) {
      return errorResponse(res, 'PDF not found', 404);
    }

    if (title) pdf.title = title;
    if (description !== undefined) pdf.description = description;
    if (category) pdf.category = category;
    if (fileUrl) pdf.fileUrl = fileUrl;
    if (fileId !== undefined) pdf.fileId = fileId;
    if (fileName !== undefined) pdf.fileName = fileName;
    if (fileSize !== undefined) pdf.fileSize = fileSize;
    if (active !== undefined) pdf.active = active;

    await pdf.save();
    return successResponse(res, pdf, 'PDF updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Delete PDF
export async function deletePdf(req, res) {
  try {
    const { id } = req.params;
    const pdf = await Pdf.findByIdAndDelete(id);
    if (!pdf) {
      return errorResponse(res, 'PDF not found', 404);
    }
    return successResponse(res, null, 'PDF deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Public: Track download count increment
export async function trackDownload(req, res) {
  try {
    const { id } = req.params;
    await Pdf.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
    return successResponse(res, null, 'Download recorded');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}