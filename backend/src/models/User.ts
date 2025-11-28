import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  skills: string[];
  languages: string[];
  timezone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  
  // Stats
  totalEarnings: number;
  completedTasks: number;
  rating: number;
  reviewCount: number;
  
  // Task assignment statistics
  statistics?: {
    totalTasksCompleted: number;
    totalTasksApproved: number;
    overallAccuracy: number;
  };
  activeAssignments?: any[];
  activeTasks?: any[];
  
  // Account status
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // OAuth
  googleId?: string;
  
  // Timestamps
  joinedDate: Date;
  lastLoginDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function(this: IUser): boolean {
      // Password is required only if no OAuth ID is present
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  timezone: {
    type: String,
    default: 'UTC'
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  
  // Stats
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  completedTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Task assignment statistics
  statistics: {
    totalTasksCompleted: { type: Number, default: 0 },
    totalTasksApproved: { type: Number, default: 0 },
    overallAccuracy: { type: Number, default: 0 },
  },
  activeAssignments: [{ type: Schema.Types.ObjectId, ref: 'TaskAssignment' }],
  activeTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // OAuth
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  
  // Timestamps
  joinedDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: Date
}, {
  timestamps: true
});

// Index for faster queries
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate verification token
UserSchema.methods.generateVerificationToken = function(): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  this.verificationToken = token;
  return token;
};

export default mongoose.model<IUser>('User', UserSchema);