import Pdf from '../models/Pdf.js';
import ImageKit from 'imagekit';
import { successResponse, errorResponse } from '../utils/response.js';

// Initialize ImageKit (Ensure your env keys are set)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

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
    let { title, description, category, fileUrl, fileId, fileName, fileSize, active } = req.body;

    // Handle uploaded file from multer (whether sent as 'file', 'pdf', or any field via upload.any())
    const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (uploadedFile) {
      const uploadResponse = await imagekit.upload({
        file: uploadedFile.buffer,
        fileName: uploadedFile.originalname,
        folder: '/products/pdf/',
      });

      fileUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
      fileName = uploadResponse.name;
      fileSize = uploadedFile.size;
    }

    if (!title || !fileUrl) {
      return errorResponse(res, 'Title and PDF file attachment are required', 400);
    }

    const pdf = await Pdf.create({
      title: title.trim(),
      description: description || '',
      category: category || 'Machinery Datasheet',
      fileUrl,
      fileId,
      fileName,
      fileSize,
      active: active !== undefined ? String(active) === 'true' : true,
    });

    return successResponse(res, pdf, 'PDF uploaded successfully', 201);
  } catch (error) {
    console.error('[PDF Create Error]', error);
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Update PDF details
export async function updatePdf(req, res) {
  try {
    const { id } = req.params;
    let { title, description, category, fileUrl, fileId, fileName, fileSize, active } = req.body;

    const pdf = await Pdf.findById(id);
    if (!pdf) {
      return errorResponse(res, 'PDF not found', 404);
    }

    const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (uploadedFile) {
      const uploadResponse = await imagekit.upload({
        file: uploadedFile.buffer,
        fileName: uploadedFile.originalname,
        folder: '/products/pdf/',
      });

      fileUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
      fileName = uploadResponse.name;
      fileSize = uploadedFile.size;
    }

    if (title) pdf.title = title.trim();
    if (category) pdf.category = category;
    if (fileUrl) pdf.fileUrl = fileUrl;
    if (fileId !== undefined) pdf.fileId = fileId;
    if (fileName !== undefined) pdf.fileName = fileName;
    if (fileSize !== undefined) pdf.fileSize = fileSize;
    if (active !== undefined) pdf.active = String(active) === 'true';

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