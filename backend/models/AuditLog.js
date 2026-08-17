import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'FAILED_LOGIN',
        'CREATE_PRODUCT',
        'UPDATE_PRODUCT',
        'DELETE_PRODUCT',
        'UPDATE_ENQUIRY',
        'UPLOAD_FILE',
        'DELETE_FILE',
      ],
      index: true,
    },
    entity: {
      type: String,
      default: 'Admin',
      trim: true,
    },
    entityId: {
      type: String,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for quick filtering and sorting in admin panel
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ adminEmail: 1, action: 1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);