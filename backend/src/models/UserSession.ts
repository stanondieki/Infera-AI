import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  deviceName: string;
  browser: string;
  os: string;
  location: string;
  city: string;
  country: string;
  ipAddress: string;
  userAgent: string;
  lastActive: Date;
  createdAt: Date;
  isActive: boolean;
  loginAttempts: Array<{
    timestamp: Date;
    status: 'success' | 'failed' | 'suspicious' | 'blocked';
    failureReason?: string;
    ipAddress: string;
    userAgent: string;
  }>;
}

const UserSessionSchema = new Schema<IUserSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  deviceType: {
    type: String,
    enum: ['Desktop', 'Mobile', 'Tablet'],
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  lastActive: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  loginAttempts: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'suspicious', 'blocked'],
      required: true
    },
    failureReason: String,
    ipAddress: String,
    userAgent: String
  }]
}, {
  timestamps: true,
  collection: 'user_sessions'
});

// Index for efficient querying
UserSessionSchema.index({ userId: 1, isActive: 1 });
UserSessionSchema.index({ sessionId: 1, isActive: 1 });
UserSessionSchema.index({ lastActive: 1 });

// Clean up old inactive sessions (older than 30 days)
UserSessionSchema.index({ lastActive: 1 }, { 
  expireAfterSeconds: 30 * 24 * 60 * 60,
  partialFilterExpression: { isActive: false }
});

export const UserSession = mongoose.model<IUserSession>('UserSession', UserSessionSchema);