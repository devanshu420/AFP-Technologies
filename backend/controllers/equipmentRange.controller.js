import EquipmentRange from "../models/EquipmentRange.js";
import { imagekit } from "../config/imagekit.js";
import {
  successResponse,
  errorResponse,
} from "../utils/response.js";
import { isValidObjectId } from "../utils/validations.js";

export const generateSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");


/*
=========================================================
GET PUBLIC EQUIPMENT
=========================================================
*/

export async function getEquipmentRange(req, res) {
  try {
    const equipment = await EquipmentRange.find({
      active: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return successResponse(res, equipment);
  } catch (err) {
    console.error("Get equipment range error:", err);

    return errorResponse(res, err.message, 500);
  }
}


/*
=========================================================
GET ADMIN EQUIPMENT
=========================================================
*/

export async function getAdminEquipmentRange(req, res) {
  try {
    const equipment = await EquipmentRange.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return successResponse(res, equipment);
  } catch (err) {
    console.error("Get admin equipment error:", err);

    return errorResponse(res, err.message, 500);
  }
}


/*
=========================================================
GET SINGLE EQUIPMENT
=========================================================
*/

export async function getEquipmentById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, "Invalid equipment ID", 400);
    }

    const equipment = await EquipmentRange.findById(id).lean();

    if (!equipment) {
      return errorResponse(res, "Equipment not found", 404);
    }

    return successResponse(res, equipment);
  } catch (err) {
    console.error("Get equipment error:", err);

    return errorResponse(res, err.message, 500);
  }
}


// =========================================================
// CREATE EQUIPMENT
// =========================================================
export async function createEquipmentRange(req, res) {
  try {
    const {
      name,
      shortDescription = "",
      description = "",
      order = 0,
    } = req.body;

    if (!name?.trim()) {
      return errorResponse(res, "Equipment name is required", 400);
    }

    if (!req.file) {
      return errorResponse(res, "Equipment image is required", 400);
    }

    // Upload file buffer to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `equipment_${Date.now()}_${req.file.originalname}`,
      folder: "/equipment-range",
    });

    const imageData = {
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
      alt: name.trim(),
    };

    let slug = generateSlug(name);
    let counter = 1;
    while (await EquipmentRange.findOne({ slug })) {
      slug = `${generateSlug(name)}-${counter++}`;
    }

    const equipment = await EquipmentRange.create({
      name: name.trim(),
      slug,
      shortDescription,
      description,
      image: imageData,
      order,
      active: true,
    });

    return successResponse(res, equipment, 201);
  } catch (err) {
    console.error("Create equipment error:", err);
    return errorResponse(res, err.message, 500);
  }
}


// =========================================================
// UPDATE EQUIPMENT
// =========================================================
export async function updateEquipmentRange(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, "Invalid equipment ID", 400);
    }

    const equipment = await EquipmentRange.findById(id);

    if (!equipment) {
      return errorResponse(res, "Equipment not found", 404);
    }

    const {
      name,
      shortDescription,
      description,
      order,
      active,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return errorResponse(res, "Equipment name is required", 400);
      }
      equipment.name = name.trim();
    }

    if (shortDescription !== undefined) {
      equipment.shortDescription = shortDescription;
    }

    if (description !== undefined) {
      equipment.description = description;
    }

    if (order !== undefined) {
      equipment.order = Number(order) || 0;
    }

    if (active !== undefined) {
      equipment.active = Boolean(active);
    }

    // Handle New Image Upload if provided
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `equipment_${Date.now()}_${req.file.originalname}`,
        folder: "/equipment-range",
      });

      const oldFileId = equipment.image?.fileId;

      equipment.image = {
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
        alt: name ? name.trim() : equipment.name,
      };

      // Delete old image from ImageKit if it exists
      if (oldFileId) {
        try {
          await imagekit.deleteFile(oldFileId);
        } catch (error) {
          console.warn("Old equipment image delete warning:", error.message);
        }
      }
    }

    await equipment.save();

    return successResponse(res, equipment);
  } catch (err) {
    console.error("Update equipment error:", err);
    return errorResponse(res, err.message, 500);
  }
}


/*
=========================================================
REMOVE / HIDE
=========================================================
*/

export async function removeFromEquipmentRange(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(
        res,
        "Invalid equipment ID",
        400
      );
    }

    const equipment =
      await EquipmentRange.findByIdAndUpdate(
        id,
        {
          active: false,
        },
        {
          new: true,
        }
      );

    if (!equipment) {
      return errorResponse(
        res,
        "Equipment not found",
        404
      );
    }

    return successResponse(res, {
      message:
        "Equipment removed from Equipment Range",
      equipment,
    });
  } catch (err) {
    console.error("Remove equipment error:", err);

    return errorResponse(res, err.message, 500);
  }
}


/*
=========================================================
ADD / SHOW
=========================================================
*/

export async function addToEquipmentRange(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(
        res,
        "Invalid equipment ID",
        400
      );
    }

    const equipment =
      await EquipmentRange.findByIdAndUpdate(
        id,
        {
          active: true,
        },
        {
          new: true,
        }
      );

    if (!equipment) {
      return errorResponse(
        res,
        "Equipment not found",
        404
      );
    }

    return successResponse(res, {
      message:
        "Equipment added to Equipment Range",
      equipment,
    });
  } catch (err) {
    console.error("Add equipment error:", err);

    return errorResponse(res, err.message, 500);
  }
}


/*
=========================================================
PERMANENT DELETE
=========================================================
*/

export async function deleteEquipmentRange(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(
        res,
        "Invalid equipment ID",
        400
      );
    }

    const equipment =
      await EquipmentRange.findById(id);

    if (!equipment) {
      return errorResponse(
        res,
        "Equipment not found",
        404
      );
    }


    /*
    Delete ImageKit image
    */

    if (equipment.image?.fileId) {
      try {
        await imagekit.deleteFile(
          equipment.image.fileId
        );
      } catch (error) {
        console.warn(
          "Equipment image delete warning:",
          error.message
        );
      }
    }


    await EquipmentRange.deleteOne({
      _id: equipment._id,
    });


    return successResponse(res, {
      message:
        "Equipment deleted permanently",
    });
  } catch (err) {
    console.error("Delete equipment error:", err);

    return errorResponse(res, err.message, 500);
  }
}