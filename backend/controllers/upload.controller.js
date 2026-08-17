import { imagekit } from "../config/imagekit.js";
import { successResponse, errorResponse } from "../utils/response.js";

// 1. Image Upload to ImageKit (/products)
export async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return errorResponse(res, "No image file provided", 400);
    }

    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: fileName,
      folder: "/products",
    });

    return successResponse(
      res,
      {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
      },
      "Image uploaded to ImageKit successfully",
      201,
    );
  } catch (err) {
    return errorResponse(
      res,
      err.message || "ImageKit image upload failed",
      500,
    );
  }
}

// 2. PDF Upload to ImageKit (/products/pdf)
export async function uploadPdf(req, res) {
  try {
    if (!req.file) {
      return errorResponse(res, "No PDF file provided", 400);
    }

    const cleanOriginalName = req.file.originalname
      .replace(/\.pdf$/i, "")
      .trim()
      .replace(/\s+/g, "_");

    const fileName = `${cleanOriginalName}-afptechnologies-${Date.now()}.pdf`;
    
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: fileName,
      folder: "/products/pdf",
    });

    return successResponse(
      res,
      {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: req.file.originalname,
      },
      "PDF brochure uploaded to ImageKit successfully",
      201,
    );
  } catch (err) {
    return errorResponse(res, err.message || "ImageKit PDF upload failed", 500);
  }
}

// 3. Delete Asset from ImageKit
export async function deleteImageKitAsset(req, res) {
  try {
    const { fileId } = req.body;
    if (!fileId) return errorResponse(res, "fileId is required", 400);

    await imagekit.deleteFile(fileId);
    return successResponse(res, null, "Asset removed from ImageKit");
  } catch (err) {
    return errorResponse(
      res,
      err.message || "ImageKit asset deletion failed",
      500,
    );
  }
}
