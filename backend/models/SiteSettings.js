import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    salesPhoneNumber: {
      type: String,
      default: '+91 98765 43210',
      trim: true,
    },
    inquiryEmail: {
      type: String,
      default: 'afptechsupport@gmail.com',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);