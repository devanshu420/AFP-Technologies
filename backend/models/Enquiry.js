import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    product: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'completed', 'rejected'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);