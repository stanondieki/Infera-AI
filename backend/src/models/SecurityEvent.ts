import mongoose, { Document, Schema } from 'mongoose';

export interface ISecurityEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: 'password_change' | 'session_revoked' | 'suspicious_login' | 'account_locked' | 'security_alert' | 'login_success' | 'login_failed';
  description: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    sessionId?: string;
    failureReason?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
}

const SecurityEventSchema = new Schema<ISecurityEvent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  eventType: {
    type: String,
    enum: ['password_change', 'session_revoked', 'suspicious_login', 'account_locked', 'security_alert', 'login_success', 'login_failed'],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: String,
    sessionId: String,
    failureReason: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  resolved: {
    type: Boolean,
    default: false,
    index: true
  },
  resolvedAt: Date,
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'security_events'
});

// Indexes for efficient querying
SecurityEventSchema.index({ userId: 1, timestamp: -1 });
SecurityEventSchema.index({ eventType: 1, timestamp: -1 });
SecurityEventSchema.index({ resolved: 1, timestamp: -1 });

export const SecurityEvent = mongoose.model<ISecurityEvent>('SecurityEvent', SecurityEventSchema);