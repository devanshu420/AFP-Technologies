import SiteSettings from '../models/SiteSettings.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Public/Admin: Get Contact info
export async function getContactSettings(req, res) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        salesPhoneNumber: '+91 98765 43210',
        inquiryEmail: 'afptechsupport@gmail.com',
      });
    }
    return successResponse(res, settings);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

// Admin: Update only Phone and Email
export async function updateContactSettings(req, res) {
  try {
    const { salesPhoneNumber, inquiryEmail } = req.body;
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({ salesPhoneNumber, inquiryEmail });
    } else {
      if (salesPhoneNumber) settings.salesPhoneNumber = salesPhoneNumber;
      if (inquiryEmail) settings.inquiryEmail = inquiryEmail;
      await settings.save();
    }

    return successResponse(res, settings, 'Contact details updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}