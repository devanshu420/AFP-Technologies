import Announcement from '../models/Announcement.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Public: Get active announcement
export async function getActiveAnnouncement(req, res) {
  try {
    const ad = await Announcement.findOne({ active: true }).sort({ createdAt: -1 });
    return successResponse(res, ad || null, 'Announcement fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Get all announcements
export async function getAllAdminAnnouncements(req, res) {
  try {
    const ads = await Announcement.find().sort({ createdAt: -1 });
    return successResponse(res, ads, 'All announcements retrieved');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Create announcement
export async function createAnnouncement(req, res) {
  try {
    const { title, description, badgeText, linkText, linkUrl, active } = req.body;
    if (!title || !description) {
      return errorResponse(res, 'Title and description are required', 400);
    }
    const ad = await Announcement.create({
      title,
      description,
      badgeText,
      linkText,
      linkUrl,
      active: active !== undefined ? active : true,
    });
    return successResponse(res, ad, 'Announcement created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Update announcement
export async function updateAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const { title, description, badgeText, linkText, linkUrl, active } = req.body;

    const ad = await Announcement.findById(id);
    if (!ad) return errorResponse(res, 'Announcement not found', 404);

    if (title) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (badgeText) ad.badgeText = badgeText;
    if (linkText) ad.linkText = linkText;
    if (linkUrl) ad.linkUrl = linkUrl;
    if (active !== undefined) ad.active = active;

    await ad.save();
    return successResponse(res, ad, 'Announcement updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

// Admin: Delete announcement
export async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const ad = await Announcement.findByIdAndDelete(id);
    if (!ad) return errorResponse(res, 'Announcement not found', 404);
    return successResponse(res, null, 'Announcement deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}