import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      alt: { type: String, default: '' },
    },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', CategorySchema);