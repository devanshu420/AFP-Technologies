import mongoose from 'mongoose';

const DownloadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Brochure' },
    file: {
      url: { type: String, required: true },
      fileId: { type: String, required: true },
      name: { type: String, required: true },
    },
    thumbnail: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
    },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Download', DownloadSchema);