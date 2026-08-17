import Enquiry from '../models/Enquiry.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { isValidObjectId } from '../utils/validations.js';
import { sendAdminNotification, sendUserConfirmation } from '../services/email.service.js';

/**
 * 1. Public Endpoint: Create New Contact/Product Enquiry
 * - Saves lead into MongoDB
 * - Sends Admin alert email (with Name, Email, Phone, Company, Product & Message)
 * - Sends Confirmation email to the User
 */
export async function createPublicEnquiry(req, res) {
  try {
    const { name, email, phone, company, message, product } = req.body || {};

    if (!name || !email) {
      return errorResponse(res, 'Name and work email are required', 400, 'VALIDATION_ERROR');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Create Enquiry document in MongoDB
    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : undefined,
      company: company ? company.trim() : undefined,
      message: message ? message.trim() : undefined,
      product: product ? product.trim() : undefined,
      status: 'new',
    });

    // 2. Dispatch Emails in background via Promise.allSettled
    Promise.allSettled([
      sendAdminNotification({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        company: enquiry.company,
        product: enquiry.product,
        message: enquiry.message,
      }),
      sendUserConfirmation({
        name: enquiry.name,
        email: enquiry.email,
      }),
    ])
      .then((results) => {
        results.forEach((res, index) => {
          if (res.status === 'rejected') {
            console.error(`[MAIL DISPATCH FAIL ${index === 0 ? 'ADMIN' : 'USER'}]:`, res.reason);
          }
        });
      })
      .catch((err) => console.error('[EMAIL GENERAL ERROR]:', err));

    return successResponse(res, enquiry, 'Enquiry submitted successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message || 'Failed to submit enquiry', 500);
  }
}

/**
 * 2. Admin Endpoint: Get All Enquiries (With Pagination & Status Filter)
 */
export async function getAllEnquiries(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(query),
    ]);

    return successResponse(res, {
      enquiries,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * 3. Admin Endpoint: Get Single Enquiry by ID
 */
export async function getEnquiryById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid enquiry ID format', 400);
    }

    const enquiry = await Enquiry.findById(id).lean();
    if (!enquiry) {
      return errorResponse(res, 'Enquiry not found', 404, 'NOT_FOUND');
    }

    return successResponse(res, enquiry);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * 4. Admin Endpoint: Update Enquiry Status
 */
export async function updateEnquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid enquiry ID format', 400);
    }

    const validStatuses = ['new', 'contacted', 'in-progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return errorResponse(
        res,
        `Invalid status value. Allowed: ${validStatuses.join(', ')}`,
        400
      );
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return errorResponse(res, 'Enquiry not found', 404, 'NOT_FOUND');
    }

    return successResponse(res, enquiry, 'Enquiry status updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * 5. Admin Endpoint: Delete Single Enquiry
 */
export async function deleteEnquiry(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return errorResponse(res, 'Invalid enquiry ID format', 400);
    }

    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return errorResponse(res, 'Enquiry not found', 404, 'NOT_FOUND');
    }

    return successResponse(res, null, 'Enquiry deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}