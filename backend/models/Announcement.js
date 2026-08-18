import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    badgeText: { type: String, default: 'SPECIAL ANNOUNCEMENT' },
    linkText: { type: String, default: 'Learn More' },
    linkUrl: { type: String, default: '/products' },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);